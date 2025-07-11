import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  Send, 
  Eye, 
  Crown,
  Clock,
  TrendingUp,
  Heart,
  BookOpen,
  Paperclip,
  Download,
  X
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ClientJourney {
  id: number;
  userId: string;
  stage: string;
  currentFocus: string;
  nextSession: string;
  progress: string;
  challenges: string;
  wins: string;
  energyLevel: number;
  coachNotes: string;
  updatedAt: string;
}

interface ClientMessage {
  id: number;
  userId: string;
  senderId: string;
  senderRole: 'client' | 'coach';
  content: string;
  isRead: boolean;
  messageType: string;
  createdAt: string;
}

export default function AdminClientMessages() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [coachMessage, setCoachMessage] = useState("");
  const [messageType, setMessageType] = useState("text");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [journeyUpdates, setJourneyUpdates] = useState({
    stage: "",
    currentFocus: "",
    progress: "",
    challenges: "",
    wins: "",
    energyLevel: 5,
    coachNotes: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get admin access key from URL or prompt
  const adminKey = new URLSearchParams(window.location.search).get('key') || 'divine-admin-2025';

  // Fetch all client journeys
  const { data: clientJourneys = [] } = useQuery({
    queryKey: [`/api/admin/client-journeys?key=${adminKey}`],
  });

  // Fetch all users for client selection
  const { data: usersData } = useQuery({
    queryKey: [`/api/admin/users?key=${adminKey}`],
  });
  
  const users = usersData?.users || [];

  // Fetch messages for selected client
  const { data: clientMessages = [] } = useQuery({
    queryKey: [`/api/client-messages?userId=${selectedClientId}&key=${adminKey}`],
    enabled: !!selectedClientId,
  });

  // Send coach message mutation
  const sendCoachMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      return apiRequest('/api/client-messages', 'POST', {
        ...messageData,
        userId: selectedClientId,
        senderRole: 'coach'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client-messages'] });
      setCoachMessage("");
      toast({
        title: "Message sent!",
        description: "Your message has been delivered to the client.",
      });
    },
  });

  // Update client journey mutation
  const updateJourneyMutation = useMutation({
    mutationFn: async (journeyData: any) => {
      return apiRequest('/api/client-journey', 'POST', {
        ...journeyData,
        userId: selectedClientId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/client-journeys'] });
      toast({
        title: "Journey updated!",
        description: "Client journey information has been updated successfully.",
      });
    },
  });

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-attachment', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Upload failed",
        description: "Could not upload file. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSendCoachMessage = async () => {
    if (!coachMessage.trim() || !selectedClientId) return;

    let attachmentUrl = null;
    if (selectedFile) {
      attachmentUrl = await handleFileUpload(selectedFile);
      if (!attachmentUrl) return; // Upload failed
    }

    sendCoachMessageMutation.mutate({
      content: coachMessage.trim(),
      messageType,
      attachmentUrl,
    });
    
    // Clear form after sending
    setSelectedFile(null);
  };

  const handleUpdateJourney = () => {
    if (!selectedClientId) return;

    updateJourneyMutation.mutate(journeyUpdates);
  };

  const selectedClient = Array.isArray(users) ? users.find((user: any) => user.id === selectedClientId) : null;
  const selectedJourney = Array.isArray(clientJourneys) ? clientJourneys.find((journey: ClientJourney) => journey.userId === selectedClientId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-purple-600 shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 font-playfair mb-2">
            Client Communication Center
          </h1>
          <p className="text-lg text-gray-600 italic">
            Manage client journeys and direct spiritual guidance
          </p>
        </div>

        {/* Client Selection */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Select Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-purple-500"
              >
                <option value="">Choose a client...</option>
                {Array.isArray(users) && users.map((user: any) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    apiRequest('/api/admin/initialize-journeys', 'POST', { key: adminKey })
                      .then(() => {
                        queryClient.invalidateQueries({ queryKey: ['/api/admin/client-journeys'] });
                        toast({
                          title: "Journey records initialized!",
                          description: "Created journey records for all existing users.",
                        });
                      })
                      .catch((error) => {
                        toast({
                          title: "Error",
                          description: "Failed to initialize journey records.",
                        });
                      });
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Initialize Missing Journeys
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedClientId && (
          <Tabs defaultValue="messages" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="journey" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Journey Tracking
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Overview
              </TabsTrigger>
            </TabsList>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6 pb-8">
              {/* Message History */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    Conversation History
                    <Badge variant="secondary" className="ml-auto">
                      {clientMessages.length} messages
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto">
                  {clientMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No messages yet. Start the conversation below.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {clientMessages.map((msg: ClientMessage) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-lg ${
                            msg.senderRole === 'coach'
                              ? 'bg-purple-100 ml-8'
                              : 'bg-gray-100 mr-8'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={msg.senderRole === 'coach' ? 'default' : 'secondary'}>
                              {msg.senderRole === 'coach' 
                                ? 'You (Coach)' 
                                : `${selectedClient?.firstName || 'Client'} ${selectedClient?.lastName || ''}`
                              }
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                          
                          {/* Show attachment if present */}
                          {(msg as any).attachmentUrl && (
                            <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded">
                              <Paperclip className="w-4 h-4 text-gray-600" />
                              <span className="text-xs text-gray-600">Attachment: {(msg as any).attachmentUrl}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto"
                                onClick={() => window.open((msg as any).attachmentUrl, '_blank')}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          
                          {msg.messageType !== 'text' && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {msg.messageType.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Send Message */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-purple-600" />
                    Send Message to {selectedClient?.firstName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Message Type</label>
                    <select
                      value={messageType}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="text">General Message</option>
                      <option value="journey_update">Journey Update</option>
                      <option value="session_reminder">Session Reminder</option>
                      <option value="resource_share">Resource Share</option>
                    </select>
                  </div>
                  
                  <Textarea
                    value={coachMessage}
                    onChange={(e) => setCoachMessage(e.target.value)}
                    placeholder="Type your message to the client..."
                    className="min-h-[100px]"
                  />

                  {/* File Attachment Section */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Attach File (Optional)</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="flex-1"
                      />
                      {selectedFile && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <Paperclip className="w-4 h-4" />
                        <span>{selectedFile.name}</span>
                        <span className="text-xs">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleSendCoachMessage}
                    disabled={!coachMessage.trim() || sendCoachMessageMutation.isPending || uploadingFile}
                    className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                  >
                    {uploadingFile ? "Uploading..." : sendCoachMessageMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Journey Tracking Tab */}
            <TabsContent value="journey" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Client Journey Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Stage</label>
                    <select
                      value={journeyUpdates.stage}
                      onChange={(e) => setJourneyUpdates({...journeyUpdates, stage: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="">Select stage...</option>
                      <option value="onboarding">Onboarding</option>
                      <option value="active">Active Work</option>
                      <option value="breakthrough">Breakthrough</option>
                      <option value="mastery">Mastery</option>
                      <option value="integration">Integration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Energy Level (1-10)</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={journeyUpdates.energyLevel}
                      onChange={(e) => setJourneyUpdates({...journeyUpdates, energyLevel: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Current Focus</label>
                    <Textarea
                      value={journeyUpdates.currentFocus}
                      onChange={(e) => setJourneyUpdates({...journeyUpdates, currentFocus: e.target.value})}
                      placeholder="What is the client currently working on?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Recent Progress</label>
                    <Textarea
                      value={journeyUpdates.progress}
                      onChange={(e) => setJourneyUpdates({...journeyUpdates, progress: e.target.value})}
                      placeholder="Notable progress and improvements..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Current Challenges</label>
                    <Textarea
                      value={journeyUpdates.challenges}
                      onChange={(e) => setJourneyUpdates({...journeyUpdates, challenges: e.target.value})}
                      placeholder="Areas of difficulty or resistance..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Recent Wins</label>
                    <Textarea
                      value={journeyUpdates.wins}
                      onChange={(e) => setJourneyUpdates({...journeyUpdates, wins: e.target.value})}
                      placeholder="Celebrate recent achievements..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Coach Notes (Private)</label>
                    <Textarea
                      value={journeyUpdates.coachNotes}
                      onChange={(e) => setJourneyUpdates({...journeyUpdates, coachNotes: e.target.value})}
                      placeholder="Private notes for coaching reference..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button
                      onClick={handleUpdateJourney}
                      disabled={updateJourneyMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                    >
                      {updateJourneyMutation.isPending ? "Updating..." : "Update Journey"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Energy Level</h3>
                    <div className="text-3xl font-bold text-purple-600">
                      {selectedJourney?.energyLevel || 'N/A'}/10
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Current Stage</h3>
                    <div className="text-lg font-bold text-purple-600 capitalize">
                      {selectedJourney?.stage || 'Not Set'}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Total Messages</h3>
                    <div className="text-3xl font-bold text-purple-600">
                      {clientMessages.length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedJourney && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Journey Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Current Focus</h4>
                      <p className="text-gray-600">{selectedJourney.currentFocus || 'No focus set'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Recent Progress</h4>
                      <p className="text-gray-600">{selectedJourney.progress || 'No progress noted'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Current Challenges</h4>
                      <p className="text-gray-600">{selectedJourney.challenges || 'No challenges noted'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Recent Wins</h4>
                      <p className="text-gray-600">{selectedJourney.wins || 'No wins noted'}</p>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Last updated: {selectedJourney.updatedAt ? new Date(selectedJourney.updatedAt).toLocaleString() : 'Never'}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}