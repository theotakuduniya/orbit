/**
 * SkiaDoodleCanvas: Responsive, High-Accuracy Vector Doodle Space
 * Features macOS Dock-style floating toolbar inside the doodlespace,
 * full toolset: Pen, Highlighter, Eraser, Shapes (Rect, Circle, Arrow, Line, Heart),
 * Text placement, Stamp stickers, Undo/Redo, Export, and live partner sync.
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  PenTool,
  Highlighter,
  Eraser,
  Square,
  Circle,
  ArrowUpRight,
  Minus,
  Heart,
  Type,
  Smile,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Sparkles,
  ChevronUp,
  X,
  Check
} from 'lucide-react';
import { haptics } from '../../utils/haptics';

export type ToolMode =
  | 'pen'
  | 'highlighter'
  | 'eraser'
  | 'rect'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'heart'
  | 'text'
  | 'sticker';

export interface StrokeItem {
  type: 'stroke';
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  mode: 'pen' | 'highlighter';
}

export interface ShapeItem {
  type: 'shape';
  id: string;
  shapeType: 'rect' | 'circle' | 'arrow' | 'line' | 'heart';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  width: number;
}

export interface TextItem {
  type: 'text';
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
}

export interface StickerItem {
  type: 'sticker';
  id: string;
  x: number;
  y: number;
  emoji: string;
  size: number;
}

export type CanvasItem = StrokeItem | ShapeItem | TextItem | StickerItem;

const PALETTE = [
  '#6750A4', // MD3 Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#0EA5E9', // Sky Blue
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#0F172A', // Dark Slate
  '#FFFFFF', // White
];

const BRUSH_SIZES = [2, 4, 8, 14, 22];
const STICKERS = ['💖', '✨', '⚡', '🥑', '🐱', '☕', '💌', '🌸'];

export const SkiaDoodleCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas State & History - starts completely empty
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [redoStack, setRedoStack] = useState<CanvasItem[]>([]);

  // Active Drawing Settings
  const [currentTool, setCurrentTool] = useState<ToolMode>('pen');
  const [color, setColor] = useState<string>('#6750A4');
  const [brushWidth, setBrushWidth] = useState<number>(4);
  const [activeSticker, setActiveSticker] = useState<string>('💖');

  // Interactive Live Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeStrokePoints, setActiveStrokePoints] = useState<{ x: number; y: number }[]>([]);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [shapeCurrent, setShapeCurrent] = useState<{ x: number; y: number } | null>(null);

  // Text Tool Overlay State
  const [activeTextInput, setActiveTextInput] = useState<{
    x: number;
    y: number;
    canvasX: number;
    canvasY: number;
  } | null>(null);
  const [textInputValue, setTextInputValue] = useState('');

  // Dock Popover Menus
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showBrushPicker, setShowBrushPicker] = useState(false);

  // Partner Drawing Simulation
  const [isPartnerDrawing, setIsPartnerDrawing] = useState(false);

  // Helper: Calculate 100% accurate coordinates regardless of screen scale / DPR
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Helper: Draw a single item onto context
  const renderItem = useCallback((ctx: CanvasRenderingContext2D, item: CanvasItem) => {
    ctx.save();

    if (item.type === 'stroke') {
      if (item.points.length < 2) {
        ctx.restore();
        return;
      }
      ctx.beginPath();
      ctx.moveTo(item.points[0].x, item.points[0].y);

      for (let i = 1; i < item.points.length; i++) {
        const xc = (item.points[i].x + item.points[i - 1].x) / 2;
        const yc = (item.points[i].y + item.points[i - 1].y) / 2;
        ctx.quadraticCurveTo(item.points[i - 1].x, item.points[i - 1].y, xc, yc);
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.mode === 'highlighter' ? item.width * 2.8 : item.width;
      ctx.globalAlpha = item.mode === 'highlighter' ? 0.35 : 1.0;
      ctx.stroke();
    } else if (item.type === 'shape') {
      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const w = item.endX - item.startX;
      const h = item.endY - item.startY;

      if (item.shapeType === 'rect') {
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(item.startX, item.startY, w, h, 8) : ctx.rect(item.startX, item.startY, w, h);
        ctx.stroke();
      } else if (item.shapeType === 'circle') {
        const radiusX = Math.abs(w / 2);
        const radiusY = Math.abs(h / 2);
        const centerX = item.startX + w / 2;
        const centerY = item.startY + h / 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (item.shapeType === 'line') {
        ctx.beginPath();
        ctx.moveTo(item.startX, item.startY);
        ctx.lineTo(item.endX, item.endY);
        ctx.stroke();
      } else if (item.shapeType === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(item.startX, item.startY);
        ctx.lineTo(item.endX, item.endY);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(item.endY - item.startY, item.endX - item.startX);
        const headLen = Math.max(12, item.width * 2.5);
        ctx.beginPath();
        ctx.moveTo(item.endX, item.endY);
        ctx.lineTo(
          item.endX - headLen * Math.cos(angle - Math.PI / 6),
          item.endY - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(item.endX, item.endY);
        ctx.lineTo(
          item.endX - headLen * Math.cos(angle + Math.PI / 6),
          item.endY - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      } else if (item.shapeType === 'heart') {
        const cx = item.startX + w / 2;
        const cy = item.startY + h / 2;
        const size = Math.min(Math.abs(w), Math.abs(h)) / 30;
        ctx.beginPath();
        for (let t = 0; t <= Math.PI * 2; t += 0.05) {
          const x = cx + 16 * Math.pow(Math.sin(t), 3) * size;
          const y =
            cy -
            (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * size;
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    } else if (item.type === 'text') {
      ctx.fillStyle = item.color;
      ctx.font = `bold ${item.fontSize}px 'Plus Jakarta Sans', system-ui, sans-serif`;
      ctx.fillText(item.text, item.x, item.y);
    } else if (item.type === 'sticker') {
      ctx.font = `${item.size}px system-ui, sans-serif`;
      ctx.fillText(item.emoji, item.x, item.y);
    }

    ctx.restore();
  }, []);

  // Main canvas redraw loop
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background subtly
    ctx.save();
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.08)';
    ctx.lineWidth = 1;
    const step = 32;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();

    // Render committed items
    items.forEach((item) => renderItem(ctx, item));

    // Render active live stroke preview
    if (activeStrokePoints.length > 1) {
      renderItem(ctx, {
        type: 'stroke',
        id: 'active_stroke',
        points: activeStrokePoints,
        color,
        width: brushWidth,
        mode: currentTool === 'highlighter' ? 'highlighter' : 'pen',
      });
    }

    // Render active shape preview
    if (shapeStart && shapeCurrent) {
      renderItem(ctx, {
        type: 'shape',
        id: 'active_shape',
        shapeType: currentTool as any,
        startX: shapeStart.x,
        startY: shapeStart.y,
        endX: shapeCurrent.x,
        endY: shapeCurrent.y,
        color,
        width: brushWidth,
      });
    }
  }, [items, activeStrokePoints, shapeStart, shapeCurrent, color, brushWidth, currentTool, renderItem]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const coords = getCanvasCoords(e);

    // Close any floating popover menus
    setShowColorPicker(false);
    setShowShapePicker(false);
    setShowStickerPicker(false);
    setShowBrushPicker(false);

    if (currentTool === 'text') {
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveTextInput({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        canvasX: coords.x,
        canvasY: coords.y,
      });
      setTextInputValue('');
      haptics.selection();
      return;
    }

    if (currentTool === 'sticker') {
      haptics.selection();
      const newStk: StickerItem = {
        type: 'sticker',
        id: `stk_${Date.now()}`,
        x: coords.x - 16,
        y: coords.y + 16,
        emoji: activeSticker,
        size: 38,
      };
      setItems((prev) => [...prev, newStk]);
      setRedoStack([]);
      return;
    }

    if (currentTool === 'eraser') {
      haptics.light();
      // Hit-test erase items within radius
      const eraseRadius = 24;
      setItems((prev) =>
        prev.filter((item) => {
          if (item.type === 'stroke') {
            return !item.points.some(
              (p) => Math.hypot(p.x - coords.x, p.y - coords.y) < eraseRadius
            );
          }
          if (item.type === 'shape') {
            return Math.hypot(item.startX - coords.x, item.startY - coords.y) >= eraseRadius;
          }
          if (item.type === 'text' || item.type === 'sticker') {
            return Math.hypot(item.x - coords.x, item.y - coords.y) >= eraseRadius * 1.5;
          }
          return true;
        })
      );
      setIsDrawing(true);
      return;
    }

    if (currentTool === 'pen' || currentTool === 'highlighter') {
      haptics.light();
      setIsDrawing(true);
      setActiveStrokePoints([coords]);
      return;
    }

    // Shapes
    if (['rect', 'circle', 'arrow', 'line', 'heart'].includes(currentTool)) {
      haptics.light();
      setIsDrawing(true);
      setShapeStart(coords);
      setShapeCurrent(coords);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);

    if (currentTool === 'eraser') {
      const eraseRadius = 24;
      setItems((prev) =>
        prev.filter((item) => {
          if (item.type === 'stroke') {
            return !item.points.some(
              (p) => Math.hypot(p.x - coords.x, p.y - coords.y) < eraseRadius
            );
          }
          return true;
        })
      );
      return;
    }

    if (currentTool === 'pen' || currentTool === 'highlighter') {
      setActiveStrokePoints((prev) => [...prev, coords]);
      return;
    }

    if (shapeStart) {
      setShapeCurrent(coords);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (!isDrawing) return;
    setIsDrawing(false);

    if ((currentTool === 'pen' || currentTool === 'highlighter') && activeStrokePoints.length > 1) {
      const newStroke: StrokeItem = {
        type: 'stroke',
        id: `stroke_${Date.now()}`,
        points: activeStrokePoints,
        color,
        width: brushWidth,
        mode: currentTool === 'highlighter' ? 'highlighter' : 'pen',
      };
      setItems((prev) => [...prev, newStroke]);
      setRedoStack([]);
      setActiveStrokePoints([]);
      return;
    }

    if (shapeStart && shapeCurrent) {
      const newShape: ShapeItem = {
        type: 'shape',
        id: `shape_${Date.now()}`,
        shapeType: currentTool as any,
        startX: shapeStart.x,
        startY: shapeStart.y,
        endX: shapeCurrent.x,
        endY: shapeCurrent.y,
        color,
        width: brushWidth,
      };
      setItems((prev) => [...prev, newShape]);
      setRedoStack([]);
      setShapeStart(null);
      setShapeCurrent(null);
    }
  };

  // Submit Text on Canvas
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTextInput || !textInputValue.trim()) {
      setActiveTextInput(null);
      return;
    }
    haptics.selection();
    const newText: TextItem = {
      type: 'text',
      id: `text_${Date.now()}`,
      x: activeTextInput.canvasX,
      y: activeTextInput.canvasY,
      text: textInputValue.trim(),
      color,
      fontSize: Math.max(16, brushWidth * 4),
    };
    setItems((prev) => [...prev, newText]);
    setRedoStack([]);
    setActiveTextInput(null);
    setTextInputValue('');
  };

  // Undo / Redo / Clear
  const handleUndo = () => {
    if (items.length === 0) return;
    haptics.selection();
    const last = items[items.length - 1];
    setItems((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [last, ...prev]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    haptics.selection();
    const next = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setItems((prev) => [...prev, next]);
  };

  const handleClear = () => {
    haptics.heavy();
    setItems([]);
    setRedoStack([]);
  };

  // Export as PNG
  const handleExportPNG = () => {
    haptics.success();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `orbit_doodle_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Partner live vector drawing simulation
  const simulatePartnerDoodle = () => {
    haptics.success();
    setIsPartnerDrawing(true);
    const partnerColor = '#EC4899';
    const centerX = 500;
    const centerY = 320;

    const heartPoints: { x: number; y: number }[] = [];
    for (let t = 0; t <= Math.PI * 2; t += 0.12) {
      const x = centerX + 16 * Math.pow(Math.sin(t), 3) * 6;
      const y =
        centerY -
        (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 6;
      heartPoints.push({ x, y });
    }

    let i = 0;
    const strokeId = `partner_heart_${Date.now()}`;
    const partnerStroke: StrokeItem = {
      type: 'stroke',
      id: strokeId,
      points: [heartPoints[0]],
      color: partnerColor,
      width: 5,
      mode: 'pen',
    };

    setItems((prev) => [...prev, partnerStroke]);

    const interval = setInterval(() => {
      i++;
      if (i < heartPoints.length) {
        partnerStroke.points.push(heartPoints[i]);
        setItems((prev) => [
          ...prev.filter((it) => it.id !== strokeId),
          { ...partnerStroke, points: [...partnerStroke.points] },
        ]);
      } else {
        clearInterval(interval);
        setIsPartnerDrawing(false);
      }
    }, 35);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto px-1 sm:px-3 pb-16 select-none">
      {/* Top Header Strip: Quick title, Undo/Redo, Clear, Partner Draw */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PenTool className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
            <span>Orbit Doodlespace</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Partner Live Draw Simulation */}
          <button
            onClick={simulatePartnerDoodle}
            disabled={isPartnerDrawing}
            className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 active:scale-95 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
            <span className="hidden xs:inline">
              {isPartnerDrawing ? 'Sam is drawing...' : 'Sam Draw 💖'}
            </span>
          </button>

          <button
            onClick={handleUndo}
            disabled={items.length === 0}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] disabled:opacity-30"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] disabled:opacity-30"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportPNG}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#6750A4] dark:hover:text-[#D0BCFF]"
            title="Export PNG"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Expansive Drawing Viewport with Floating macOS Dock */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-[520px] sm:h-[620px] bg-white dark:bg-[#1A1822] rounded-3xl shadow-xl border border-black/[0.08] dark:border-white/[0.1] overflow-hidden"
      >
        {/* Full-Resolution Position-Accurate Canvas */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={760}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Text Tool In-Place Input Overlay */}
        {activeTextInput && (
          <div
            style={{ left: activeTextInput.x, top: activeTextInput.y }}
            className="absolute z-30 -translate-y-1/2 animate-in zoom-in-95 duration-100"
          >
            <form onSubmit={handleTextSubmit} className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#26232D] rounded-xl shadow-2xl border border-purple-400">
              <input
                autoFocus
                type="text"
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
                placeholder="Type text..."
                style={{ color }}
                className="px-2.5 py-1 text-xs font-bold bg-transparent outline-none min-w-[140px]"
              />
              <button
                type="submit"
                className="w-6 h-6 rounded-lg bg-[#6750A4] text-white flex items-center justify-center shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTextInput(null)}
                className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* FLOATING MAC DOCK-STYLE TOOLBAR (INSIDE DOODLESPACE) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[95%]">
          <div className="relative backdrop-blur-2xl bg-white/80 dark:bg-[#1E1B26]/85 border border-white/60 dark:border-white/10 shadow-2xl rounded-2xl p-1.5 flex items-center gap-1 sm:gap-1.5 transition-all">
            {/* Tool 1: Pen */}
            <button
              onClick={() => {
                haptics.light();
                setCurrentTool('pen');
              }}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-150 active:scale-90 ${
                currentTool === 'pen'
                  ? 'bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] shadow-xs scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Pen Tool"
            >
              <PenTool className="w-4 h-4" />
            </button>

            {/* Tool 2: Highlighter */}
            <button
              onClick={() => {
                haptics.light();
                setCurrentTool('highlighter');
              }}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-150 active:scale-90 ${
                currentTool === 'highlighter'
                  ? 'bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] shadow-xs scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Highlighter"
            >
              <Highlighter className="w-4 h-4" />
            </button>

            {/* Tool 3: Eraser */}
            <button
              onClick={() => {
                haptics.light();
                setCurrentTool('eraser');
              }}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-150 active:scale-90 ${
                currentTool === 'eraser'
                  ? 'bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] shadow-xs scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Eraser"
            >
              <Eraser className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-0.5" />

            {/* Tool 4: Shapes Menu Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  haptics.selection();
                  setShowShapePicker(!showShapePicker);
                  setShowColorPicker(false);
                  setShowStickerPicker(false);
                  setShowBrushPicker(false);
                }}
                className={`p-2 sm:p-2.5 rounded-xl transition-all duration-150 active:scale-90 flex items-center gap-0.5 ${
                  ['rect', 'circle', 'arrow', 'line', 'heart'].includes(currentTool)
                    ? 'bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Shapes"
              >
                {currentTool === 'rect' && <Square className="w-4 h-4" />}
                {currentTool === 'circle' && <Circle className="w-4 h-4" />}
                {currentTool === 'arrow' && <ArrowUpRight className="w-4 h-4" />}
                {currentTool === 'line' && <Minus className="w-4 h-4" />}
                {currentTool === 'heart' && <Heart className="w-4 h-4 fill-current text-rose-500" />}
                {!['rect', 'circle', 'arrow', 'line', 'heart'].includes(currentTool) && (
                  <Square className="w-4 h-4" />
                )}
                <ChevronUp className="w-2.5 h-2.5 opacity-60" />
              </button>

              {showShapePicker && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 p-1.5 rounded-2xl bg-white dark:bg-[#26232D] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] flex items-center gap-1 z-30 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setCurrentTool('rect');
                      setShowShapePicker(false);
                    }}
                    className="p-2 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                    title="Rectangle"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTool('circle');
                      setShowShapePicker(false);
                    }}
                    className="p-2 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                    title="Circle"
                  >
                    <Circle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTool('arrow');
                      setShowShapePicker(false);
                    }}
                    className="p-2 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                    title="Arrow"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTool('line');
                      setShowShapePicker(false);
                    }}
                    className="p-2 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                    title="Straight Line"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTool('heart');
                      setShowShapePicker(false);
                    }}
                    className="p-2 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-rose-500"
                    title="Romantic Heart"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              )}
            </div>

            {/* Tool 5: Text Tool */}
            <button
              onClick={() => {
                haptics.light();
                setCurrentTool('text');
              }}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-150 active:scale-90 ${
                currentTool === 'text'
                  ? 'bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] shadow-xs scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Click anywhere on canvas to type text"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Tool 6: Stickers Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  haptics.selection();
                  setShowStickerPicker(!showStickerPicker);
                  setShowColorPicker(false);
                  setShowShapePicker(false);
                  setShowBrushPicker(false);
                }}
                className={`p-2 sm:p-2.5 rounded-xl transition-all duration-150 active:scale-90 flex items-center gap-0.5 ${
                  currentTool === 'sticker'
                    ? 'bg-[#EADDFF] dark:bg-[#4F378B] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Stickers"
              >
                <Smile className="w-4 h-4" />
                <ChevronUp className="w-2.5 h-2.5 opacity-60" />
              </button>

              {showStickerPicker && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 p-1.5 rounded-2xl bg-white dark:bg-[#26232D] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] grid grid-cols-4 gap-1 z-30 animate-in fade-in zoom-in-95 w-44">
                  {STICKERS.map((stk) => (
                    <button
                      key={stk}
                      onClick={() => {
                        setActiveSticker(stk);
                        setCurrentTool('sticker');
                        setShowStickerPicker(false);
                      }}
                      className="p-1.5 text-lg rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-transform active:scale-125 text-center"
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-0.5" />

            {/* Quick Color Swatches directly visible on dock */}
            <div className="hidden sm:flex items-center gap-1">
              {['#6750A4', '#EC4899', '#10B981', '#0F172A'].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    haptics.light();
                    setColor(c);
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-125 border-purple-400 shadow-xs' : 'border-white/50 dark:border-white/20'
                  }`}
                  style={{ backgroundColor: c }}
                  title={`Select ${c}`}
                />
              ))}
            </div>

            {/* Full Color Swatch & Custom Color Picker Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  haptics.selection();
                  setShowColorPicker(!showColorPicker);
                  setShowShapePicker(false);
                  setShowStickerPicker(false);
                  setShowBrushPicker(false);
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-[#26232D] shadow-sm flex items-center justify-center transition-transform active:scale-95 ring-1 ring-black/10 dark:ring-white/20"
                style={{ backgroundColor: color }}
                title="Select Color (Pen, Shapes, Text)"
              >
                <ChevronUp className="w-3 h-3 text-white drop-shadow-md" />
              </button>

              {showColorPicker && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 p-3 rounded-2xl bg-white dark:bg-[#26232D] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-30 animate-in fade-in zoom-in-95 w-52 space-y-2.5">
                  <div className="text-[10px] font-semibold text-slate-400 text-center">
                    Tool & shape color
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setColor(c);
                          setShowColorPicker(false);
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          color === c ? 'scale-115 border-purple-500 shadow-md ring-2 ring-purple-300' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  {/* Custom Color Input */}
                  <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Custom</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent p-0"
                        title="Pick custom hex color"
                      />
                      <span className="text-[10px] font-mono text-slate-500">{color}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stroke Thickness Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  haptics.selection();
                  setShowBrushPicker(!showBrushPicker);
                  setShowColorPicker(false);
                  setShowShapePicker(false);
                  setShowStickerPicker(false);
                }}
                className="p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-black/[0.05] transition-all flex items-center gap-1 font-mono text-xs font-bold"
                title="Stroke Thickness"
              >
                <span>{brushWidth}px</span>
                <ChevronUp className="w-2.5 h-2.5 opacity-60" />
              </button>

              {showBrushPicker && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 p-2.5 rounded-2xl bg-white dark:bg-[#26232D] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] flex flex-col gap-2 z-30 animate-in fade-in zoom-in-95 w-36 text-center">
                  <span className="text-[10px] font-semibold text-slate-400">
                    Stroke width
                  </span>
                  <div className="flex items-center justify-between gap-1.5">
                    {BRUSH_SIZES.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => {
                          setBrushWidth(sz);
                          setShowBrushPicker(false);
                        }}
                        className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${
                          brushWidth === sz
                            ? 'bg-[#6750A4] text-white shadow-xs'
                            : 'bg-black/[0.05] dark:bg-white/[0.05] text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
