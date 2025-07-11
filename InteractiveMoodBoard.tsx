import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Plus, Share2, Download, Palette, Type, Image, Quote, Music, Heart, Star, Camera } from 'lucide-react';
import type { MoodBoard, MoodBoardElement } from '@shared/schema';

interface DragData {
  isDragging: boolean;
  offset: { x: number; y: number };
  elementId: number | null;
}

const DIVINE_THEMES = [
  { value: 'abundance', label: 'Abundance Manifestation', color: 'from-amber-300 to-yellow-500' },
  { value: 'love', label: 'Sacred Love', color: 'from-pink-300 to-rose-500' },
  { value: 'healing', label: 'Divine Healing', color: 'from-emerald-300 to-teal-500' },
  { value: 'wisdom', label: 'Ancient Wisdom', color: 'from-purple-300 to-indigo-500' },
  { value: 'power', label: 'Divine Feminine Power', color: 'from-orange-300 to-red-500' },
  { value: 'peace', label: 'Sacred Peace', color: 'from-blue-300 to-cyan-500' },
  { value: 'creativity', label: 'Creative Flow', color: 'from-violet-300 to-purple-500' },
  { value: 'transformation', label: 'Sacred Transformation', color: 'from-teal-300 to-green-500' }
];

const ELEMENT_TYPES = [
  { type: 'text', icon: Type, label: 'Sacred Text' },
  { type: 'affirmation', icon: Quote, label: 'Divine Affirmation' },
  { type: 'image', icon: Image, label: 'Sacred Image' },
  { type: 'vision', icon: Star, label: 'Vision Statement' },
  { type: 'gratitude', icon: Heart, label: 'Gratitude Note' },
  { type: 'music', icon: Music, label: 'Sacred Sound' }
];

export default function InteractiveMoodBoard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedBoard, setSelectedBoard] = useState<MoodBoard | null>(null);
  const [elements, setElements] = useState<MoodBoardElement[]>([]);
  const [dragData, setDragData] = useState<DragData>({ isDragging: false, offset: { x: 0, y: 0 }, elementId: null });
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('abundance');
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');

  // Fetch user's mood boards
  const { data: moodBoards, isLoading } = useQuery({
    queryKey: ['/api/mood-boards'],
    queryFn: () => apiRequest('GET', '/api/mood-boards').then(res => res.json())
  });

  // Fetch selected board elements
  const { data: boardData } = useQuery({
    queryKey: ['/api/mood-boards', selectedBoard?.id],
    queryFn: () => selectedBoard ? apiRequest('GET', `/api/mood-boards/${selectedBoard.id}`).then(res => res.json()) : null,
    enabled: !!selectedBoard
  });

  useEffect(() => {
    if (boardData?.elements) {
      setElements(boardData.elements);
    }
  }, [boardData]);

  // Create new mood board
  const createBoardMutation = useMutation({
    mutationFn: (data: { title: string; description: string; theme: string }) =>
      apiRequest('POST', '/api/mood-boards', data).then(res => res.json()),
    onSuccess: (data) => {
      setSelectedBoard(data.moodBoard);
      setIsCreatingBoard(false);
      setNewBoardTitle('');
      setNewBoardDescription('');
      queryClient.invalidateQueries({ queryKey: ['/api/mood-boards'] });
      toast({ title: "Sacred collage created", description: "Your divine mood board is ready for creation" });
    }
  });

  // Add element to board
  const addElementMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest('POST', `/api/mood-boards/${selectedBoard?.id}/elements`, data).then(res => res.json()),
    onSuccess: (data) => {
      setElements(prev => [...prev, data.element]);
      toast({ title: "Divine element added", description: "Your sacred element has been placed on the board" });
    }
  });

  // Update element position/content
  const updateElementMutation = useMutation({
    mutationFn: ({ elementId, updates }: { elementId: number; updates: any }) =>
      apiRequest('PATCH', `/api/mood-boards/${selectedBoard?.id}/elements/${elementId}`, updates).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood-boards', selectedBoard?.id] });
    }
  });

  // Handle mouse events for drag and drop
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: number) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    setDragData({
      isDragging: true,
      elementId,
      offset: {
        x: e.clientX - rect.left - (element.positionX || 0),
        y: e.clientY - rect.top - (element.positionY || 0)
      }
    });
  }, [elements]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragData.isDragging || !canvasRef.current || !dragData.elementId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragData.offset.x;
    const newY = e.clientY - rect.top - dragData.offset.y;

    // Update element position in state
    setElements(prev => prev.map(el => 
      el.id === dragData.elementId 
        ? { ...el, positionX: Math.max(0, newX), positionY: Math.max(0, newY) }
        : el
    ));
  }, [dragData]);

  const handleMouseUp = useCallback(() => {
    if (dragData.isDragging && dragData.elementId) {
      const element = elements.find(el => el.id === dragData.elementId);
      if (element) {
        // Save position to backend
        updateElementMutation.mutate({
          elementId: dragData.elementId,
          updates: { positionX: element.positionX, positionY: element.positionY }
        });
      }
    }
    setDragData({ isDragging: false, offset: { x: 0, y: 0 }, elementId: null });
  }, [dragData, elements, updateElementMutation]);

  const addElement = (type: string) => {
    if (!selectedBoard) return;

    const content = type === 'affirmation' 
      ? 'I am divinely guided and blessed' 
      : type === 'vision'
      ? 'My sacred vision manifests with divine timing'
      : type === 'gratitude'
      ? 'I am grateful for divine abundance in my life'
      : 'Sacred element';

    addElementMutation.mutate({
      type,
      content,
      positionX: Math.random() * 300,
      positionY: Math.random() * 200,
      width: type === 'text' || type === 'affirmation' ? 250 : 200,
      height: type === 'text' || type === 'affirmation' ? 100 : 150,
      styles: {
        backgroundColor: 'rgba(248, 246, 240, 0.9)',
        borderColor: '#D4AF37',
        color: '#8B7355',
        fontFamily: 'Georgia, serif'
      }
    });
  };

  const currentTheme = DIVINE_THEMES.find(theme => theme.value === selectedTheme) || DIVINE_THEMES[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-divine-gold animate-spin mx-auto mb-4" />
          <p className="text-lg text-divine-brown font-serif">Preparing your sacred canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-white p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-divine-brown mb-2">
            <Sparkles className="inline w-8 h-8 mr-2 text-divine-gold" />
            Interactive Sacred Mood Board
          </h1>
          <p className="text-lg text-divine-brown/80">Create divine collages for your spiritual growth journey</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          {/* Board Selector */}
          <Select value={selectedBoard?.id?.toString() || ''} onValueChange={(value) => {
            const board = moodBoards?.moodBoards?.find((b: MoodBoard) => b.id.toString() === value);
            setSelectedBoard(board || null);
          }}>
            <SelectTrigger className="w-64 bg-white/80 border-divine-gold/30">
              <SelectValue placeholder="Select a sacred board" />
            </SelectTrigger>
            <SelectContent>
              {moodBoards?.moodBoards?.map((board: MoodBoard) => (
                <SelectItem key={board.id} value={board.id.toString()}>
                  {board.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Create New Board */}
          <Dialog open={isCreatingBoard} onOpenChange={setIsCreatingBoard}>
            <DialogTrigger asChild>
              <Button className="bg-divine-gold hover:bg-divine-gold/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Sacred Board
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-cream-50 to-white border-divine-gold/30">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif text-divine-brown">Create Sacred Mood Board</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Board title (e.g., 'My Abundance Vision')"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="border-divine-gold/30"
                />
                <Textarea
                  placeholder="Sacred intention for this board..."
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  className="border-divine-gold/30"
                />
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="border-divine-gold/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIVINE_THEMES.map(theme => (
                      <SelectItem key={theme.value} value={theme.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.color}`}></div>
                          {theme.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => createBoardMutation.mutate({ 
                    title: newBoardTitle, 
                    description: newBoardDescription, 
                    theme: selectedTheme 
                  })}
                  disabled={!newBoardTitle}
                  className="w-full bg-divine-gold hover:bg-divine-gold/90 text-white"
                >
                  Create Sacred Canvas
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {selectedBoard && (
            <>
              <Button variant="outline" className="border-divine-gold/30 text-divine-brown">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="border-divine-gold/30 text-divine-brown">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>
      </div>

      {selectedBoard ? (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Element Palette */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-divine-gold/30 p-6 shadow-lg">
                <h3 className="text-xl font-serif text-divine-brown mb-4 flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-divine-gold" />
                  Sacred Elements
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {ELEMENT_TYPES.map(({ type, icon: Icon, label }) => (
                    <Button
                      key={type}
                      onClick={() => addElement(type)}
                      variant="outline"
                      className="flex-col h-20 border-divine-gold/30 hover:bg-divine-gold/10 text-divine-brown"
                    >
                      <Icon className="w-6 h-6 mb-1 text-divine-gold" />
                      <span className="text-xs text-center">{label}</span>
                    </Button>
                  ))}
                </div>

                {/* Theme Colors */}
                <div className="mt-6">
                  <h4 className="text-sm font-serif text-divine-brown mb-3">Divine Themes</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {DIVINE_THEMES.map(theme => (
                      <div
                        key={theme.value}
                        className={`w-8 h-8 rounded-lg bg-gradient-to-r ${theme.color} cursor-pointer border-2 ${
                          selectedTheme === theme.value ? 'border-divine-gold' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedTheme(theme.value)}
                        title={theme.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="lg:col-span-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-divine-gold/30 shadow-lg overflow-hidden">
                <div className="p-4 border-b border-divine-gold/20">
                  <h2 className="text-2xl font-serif text-divine-brown">{selectedBoard.title}</h2>
                  <p className="text-divine-brown/70">{selectedBoard.description}</p>
                  <Badge className={`mt-2 bg-gradient-to-r ${currentTheme.color} text-white`}>
                    {currentTheme.label}
                  </Badge>
                </div>

                {/* Interactive Canvas */}
                <div
                  ref={canvasRef}
                  className={`relative h-96 lg:h-[500px] bg-gradient-to-br ${currentTheme.color} bg-opacity-10 overflow-hidden`}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {elements.map((element) => (
                    <div
                      key={element.id}
                      className="absolute cursor-move bg-white/90 backdrop-blur-sm rounded-lg border border-divine-gold/30 p-3 shadow-lg hover:shadow-xl transition-shadow select-none"
                      style={{
                        left: element.positionX || 0,
                        top: element.positionY || 0,
                        width: element.width || 200,
                        height: element.height || 100,
                        zIndex: element.zIndex || 1
                      }}
                      onMouseDown={(e) => handleMouseDown(e, element.id)}
                    >
                      <div className="text-divine-brown font-serif text-sm">
                        {element.type === 'affirmation' && <Quote className="w-4 h-4 inline text-divine-gold mr-1" />}
                        {element.type === 'vision' && <Star className="w-4 h-4 inline text-divine-gold mr-1" />}
                        {element.type === 'gratitude' && <Heart className="w-4 h-4 inline text-divine-gold mr-1" />}
                        {element.content}
                      </div>
                    </div>
                  ))}

                  {/* Drop Zone Message */}
                  {elements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-divine-brown/60">
                        <Camera className="w-16 h-16 mx-auto mb-4 text-divine-gold/50" />
                        <p className="text-lg font-serif">Start creating your sacred collage</p>
                        <p className="text-sm">Add elements from the palette to begin</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center py-16">
          <Camera className="w-24 h-24 mx-auto mb-6 text-divine-gold/50" />
          <h2 className="text-3xl font-serif text-divine-brown mb-4">Begin Your Sacred Creation</h2>
          <p className="text-lg text-divine-brown/70 mb-8">
            Select an existing mood board or create a new one to start your divine visual journey
          </p>
          <Button 
            onClick={() => setIsCreatingBoard(true)}
            className="bg-divine-gold hover:bg-divine-gold/90 text-white px-8 py-3 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Sacred Board
          </Button>
        </div>
      )}
    </div>
  );
}