"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import AiResponseViewer from "../aiResponse/AiResponseViewer";
import debounce from "lodash.debounce";

// Base API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function HistoryAiFeatures() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mapping feature keys for flexibility
  const featureMap = useMemo(() => ({
    codeDebugging: "Debug",
    codeReview: "Review",
    codeGeneration: "Generate",
    explainCode: "Explain",
    convertCode: "Convert",
    generateTestCases: "Testcases",
  }), []);

  const reverseFeatureMap = useMemo(() => {
    const entries = Object.entries(featureMap);
    return Object.fromEntries(entries.map(([k, v]) => [v, k]));
  }, [featureMap]);

  const convertFeature = useCallback((key) => featureMap[key] || key, [featureMap]);
  const mapFeature = useCallback((val) => reverseFeatureMap[val] || val, [reverseFeatureMap]);

  // Debounced fetch
  const fetchInteractions = useCallback(async (filterType = "all", signal) => {
    setLoading(true);
    try {
      let response;
      if (filterType === "all") {
        response = await axios.get(`${BASE_URL}/api/ai/interactions`, {
          withCredentials: true,
          signal,
        });
      } else {
        response = await axios.post(
          `${BASE_URL}/api/ai/interactions/by-feature`,
          { featureType: mapFeature(filterType) },
          { withCredentials: true, signal }
        );
      }

      const formatted = response.data.data.map((item, idx) => ({
        _id: item._id,
        id: idx + 1,
        title: item.title || "Untitled",
        feature: convertFeature(item.featureType),
        featureType: item.featureType,
        prompt: item.userInput,
        response: item.aiResponse,
        date: new Date(item.createdAt).toLocaleDateString(),
      }));

      setHistory(formatted);
    } catch (err) {
      if (!axios.isCancel(err)) {
        toast.error("Failed to load AI history");
      }
    } finally {
      setLoading(false);
    }
  }, [mapFeature, convertFeature]);

  const debouncedFetch = useMemo(() =>
    debounce((filterType, signal) => fetchInteractions(filterType, signal), 300),
    [fetchInteractions]
  );

  useEffect(() => {
    const controller = new AbortController();
    debouncedFetch(filter, controller.signal);

    return () => controller.abort(); // cancel fetch if component unmounts
  }, [filter, debouncedFetch]);

  // View single interaction
  const handleView = useCallback(async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/ai/interactions/${id}`, {
        withCredentials: true,
      });
      setSelectedInteraction(res.data.data);
      setViewDialog(true);
    } catch {
      toast.error("Failed to load details");
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/ai/interactions/${id}`, {
        withCredentials: true,
      });
      toast.success("Deleted successfully");
      fetchInteractions(filter);
    } catch {
      toast.error("Delete failed");
    }
  }, [fetchInteractions, filter]);

  const handleDeleteAll = useCallback(async () => {
    try {
      await axios.delete(`${BASE_URL}/api/ai/interaction`, {
        withCredentials: true,
      });
      toast.success("All history cleared");
      fetchInteractions(filter);
    } catch {
      toast.error("Failed to delete all");
    }
  }, [fetchInteractions, filter]);

  const featuresList = useMemo(() => [
    "Debug", "Review", "Generate", "Explain", "Convert", "Testcases"
  ], []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">AI Feature Usage</h3>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter Feature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {featuresList.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="destructive" onClick={handleDeleteAll}>Delete All</Button>
        </div>
      </div>

      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr.No.</TableHead>
            <TableHead>Feature</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Prompt</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
            </TableRow>
          ) : history.length > 0 ? (
            history.map((f) => (
              <TableRow key={f._id}>
                <TableCell>{f.id}</TableCell>
                <TableCell><Badge variant="outline">{f.feature}</Badge></TableCell>
                <TableCell className="max-w-[180px] truncate">{f.title}</TableCell>
                <TableCell className="max-w-[250px] text-sm text-muted-foreground truncate">
                  {f.prompt.length > 80 ? f.prompt.slice(0, 80) + "..." : f.prompt}
                </TableCell>
                <TableCell className="text-muted-foreground">{f.date}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(f._id)}>View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(f._id)} className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">No AI feature usage found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* View Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedInteraction?.title || "AI Interaction Details"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4 text-sm">
            <div><strong>Feature:</strong> {convertFeature(selectedInteraction?.featureType)}</div>
            <div><strong>Date:</strong> {new Date(selectedInteraction?.createdAt).toLocaleString()}</div>
            <div>
              <strong>Prompt:</strong>
              <div className="mt-1 bg-muted p-3 rounded overflow-auto max-h-60 whitespace-pre-wrap break-words text-sm">
                <pre className="whitespace-pre-wrap">{selectedInteraction?.userInput}</pre>
              </div>
            </div>
            <AiResponseViewer
              response={selectedInteraction?.aiOutput}
              featureType={convertFeature(selectedInteraction?.featureType)}
              isHistory={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
