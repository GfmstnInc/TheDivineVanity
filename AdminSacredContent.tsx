import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Sparkles, Edit, Trash2 } from "lucide-react";
import { Link } from "wouter";
import type { 
  SacredContentLibrary, 
  InsertSacredContentLibrary 
} from "@shared/schema";

const formSchema = z.object({
  type: z.string().min(1, "Content type is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
  createdBy: z.string().min(1, "Creator is required"),
  pdfUrl: z.string().optional(),
  visibility: z.string().min(1, "Visibility is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminSacredContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      title: "",
      content: "",
      tags: "",
      createdBy: "Vanessa",
      pdfUrl: "",
      visibility: "all",
    },
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const QUERY_KEY = ["/api/admin/sacred-content", "divine-admin-2025"];
  
  const { data: sacredContent, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => apiRequest("/api/admin/sacred-content?key=divine-admin-2025", "GET"),
    retry: false,
  });

  const resetForm = () => {
    form.reset();
    setEditingId(null);
  };

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        tags: data.tags?.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag) || [],
      };
      return await apiRequest("/api/admin/sacred-content?key=divine-admin-2025", "POST", payload);
    },
    onSuccess: () => {
      toast({
        title: "Sacred Content Created",
        description: "Your sacred content has been added to Seraphine's library.",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create sacred content",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        tags: data.tags?.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag) || [],
      };
      return await apiRequest(`/api/admin/sacred-content/${editingId}?key=divine-admin-2025`, "PUT", payload);
    },
    onSuccess: () => {
      toast({
        title: "Sacred Content Updated",
        description: "Your sacred content has been successfully updated.",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update sacred content",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/sacred-content/${id}?key=divine-admin-2025`, "DELETE");
    },
    onSuccess: () => {
      toast({
        title: "Sacred Content Deleted",
        description: "The sacred content has been removed from Seraphine's library.",
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete sacred content",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (editingId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (content: SacredContentLibrary) => {
    setEditingId(content.id);
    form.reset({
      type: content.type,
      title: content.title,
      content: content.content,
      tags: Array.isArray(content.tags) ? content.tags.join(", ") : "",
      createdBy: content.createdBy,
      pdfUrl: content.pdfUrl || "",
      visibility: content.visibility,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this sacred content?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-beige">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-divine-gold text-divine-gold hover:bg-divine-gold hover:text-white">
                ← Back to Home
              </Button>
            </Link>
            <Sparkles className="h-8 w-8 text-divine-gold" />
            <h1 className="font-playfair text-4xl font-bold text-deep-charcoal">
              Seraphine Sacred Content Library
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage divine affirmations, rituals, and prayers for personalized spiritual guidance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Creation Form */}
          <Card className="border-divine-gold/20 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-divine-gold/10 to-cream/20">
              <CardTitle className="font-playfair text-2xl text-deep-charcoal flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-divine-gold" />
                {editingId ? "Edit Sacred Content" : "Create Sacred Content"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Content Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-divine-gold/30">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="affirmation">Affirmation</SelectItem>
                              <SelectItem value="ritual">Ritual</SelectItem>
                              <SelectItem value="prayer">Prayer</SelectItem>
                              <SelectItem value="meditation">Meditation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Visibility</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-divine-gold/30">
                                <SelectValue placeholder="Select visibility" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="premium">Premium Only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter sacred content title"
                            className="border-divine-gold/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the sacred content text..."
                            className="border-divine-gold/30 min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="healing, abundance, love (comma separated)"
                            className="border-divine-gold/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pdfUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">PDF URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/sacred-content.pdf"
                            className="border-divine-gold/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="bg-divine-gold hover:bg-divine-gold/90 text-white font-medium px-6"
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          {editingId ? "Updating..." : "Creating..."}
                        </div>
                      ) : (
                        editingId ? "Update Content" : "Create Content"
                      )}
                    </Button>
                    
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Sacred Content Library */}
          <Card className="border-divine-gold/20 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-divine-gold/10 to-cream/20">
              <CardTitle className="font-playfair text-2xl text-deep-charcoal flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-divine-gold" />
                Sacred Content Library
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-gray-600">
                  Manage sacred content for Seraphine's personalized guidance system
                </p>
              </div>

              <div className="border border-divine-gold/20 rounded-lg p-4 bg-gradient-to-r from-cream/20 to-white/30">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-divine-gold border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading sacred content...</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {sacredContent && Array.isArray(sacredContent) && sacredContent.length > 0 ? (
                      sacredContent.map((content: SacredContentLibrary) => (
                        <div
                          key={content.id}
                          className="p-4 border border-divine-gold/20 rounded-lg bg-gradient-to-r from-cream/30 to-white/30"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="bg-divine-gold/20 text-divine-gold border-divine-gold/30">
                                  {content.type}
                                </Badge>
                                <Badge variant="outline" className="border-gray-300 text-gray-600">
                                  {content.visibility}
                                </Badge>
                              </div>
                              
                              <h4 className="font-medium text-gray-900 mb-1">
                                {content.title}
                              </h4>
                              
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {content.content}
                              </p>
                              
                              {Array.isArray(content.tags) && content.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {content.tags.map((tag: string, index: number) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              <p className="text-xs text-gray-500">
                                By {content.createdBy} • {new Date(content.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(content)}
                                className="h-8 w-8 p-0 border-divine-gold/30 text-divine-gold hover:bg-divine-gold hover:text-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(content.id)}
                                disabled={deleteMutation.isPending}
                                className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-500 hover:text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Sparkles className="h-12 w-12 text-divine-gold/40 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No sacred content yet</p>
                        <p className="text-gray-400 text-sm">Create your first piece of sacred content to get started</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}