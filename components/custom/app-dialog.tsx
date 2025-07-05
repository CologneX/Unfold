"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface DialogConfig {
  id: string;
  children?: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  dialogType: "confirm" | "destructive";
}

class DialogQueue {
  private queue: DialogConfig[] = [];
  private currentDialog: DialogConfig | null = null;
  private isOpen: boolean = false;
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  add(config: Omit<DialogConfig, "id">) {
    const dialog: DialogConfig = {
      ...config,
      id: Math.random().toString(36).substr(2, 9),
    };

    this.queue.push(dialog);
    this.processQueue();
  }

  private processQueue() {
    if (!this.isOpen && this.queue.length > 0) {
      this.currentDialog = this.queue.shift()!;
      this.isOpen = true;
      this.notify();
    }
  }

  private close() {
    this.isOpen = false;
    this.currentDialog = null;
    this.notify();
  }

  handleConfirm() {
    if (this.currentDialog) {
      this.currentDialog.onConfirm();
      this.close();
    }
  }

  handleCancel() {
    if (this.currentDialog) {
      this.currentDialog.onCancel?.();
      this.close();
    }
  }

  getCurrentDialog() {
    return this.currentDialog;
  }

  isDialogOpen() {
    return this.isOpen;
  }

  getQueueLength() {
    return this.queue.length;
  }
}

const dialogQueue = new DialogQueue();

export function openDialog({
  children,
  title,
  description,
  onConfirm,
  onCancel,
  dialogType = "confirm",
}: {
  children?: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  dialogType?: "confirm" | "destructive";
}) {
  dialogQueue.add({
    children,
    title,
    description,
    onConfirm,
    onCancel,
    dialogType,
  });
}

export function DialogProvider() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = dialogQueue.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  const currentDialog = dialogQueue.getCurrentDialog();
  const isOpen = dialogQueue.isDialogOpen();

  if (!currentDialog) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          dialogQueue.handleCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentDialog.title}</DialogTitle>
          <DialogDescription>{currentDialog.description}</DialogDescription>
        </DialogHeader>

        {currentDialog.children && (
          <div className="py-4">{currentDialog.children}</div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => dialogQueue.handleCancel()}>
            Cancel
          </Button>
          <Button
            onClick={() => dialogQueue.handleConfirm()}
            variant={
              currentDialog.dialogType === "destructive"
                ? "destructive"
                : "default"
            }
          >
            {currentDialog.dialogType === "destructive" ? "Delete" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
