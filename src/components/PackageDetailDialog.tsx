import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  MapPin,
  Wrench,
  Lightbulb,
  Plus,
  Minus,
  ShoppingBag,
  AlertTriangle,
  Loader2,
  Search,
  Navigation,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface PackageOption {
  id: string;
  name: string;
  priceNoLights: number;
  priceWithLights: number;
  image: string;
  description: string;
  soundSpecs: string[];
  lightSpecs: string[];
  otherSpecs?: string[];
  warning?: string;
}