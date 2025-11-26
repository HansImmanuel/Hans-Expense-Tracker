'use client'

import { IconFolderCode } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import EmojiPicker , {EmojiClickData} from 'emoji-picker-react';
import { useState } from "react"
import { createBudget } from "@/app/_actions/budgetActions"
import { toast } from "sonner";
import { useEffect } from "react"


export function EmptyDemo() {

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  } , []);


  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji); 
    setOpen(false); 
  };
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isButtonDisabled = name.length === 0 || amount.length === 0 || selectedEmoji.length === 0 || isLoading;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh
    setIsLoading(true);

    const result = await createBudget(name, amount, selectedEmoji)

    setIsLoading(false)

    if (result.success) {
        // Feedback Sukses
        toast.success("Budget Created!", {
            description: "Your new budget has been saved successfully."
        });

        // Reset Form
        setName("");
        setAmount("");
        setSelectedEmoji("");
        setOpen(false); // Tutup modal
    } else {
        // Feedback Gagal
        toast.error("Error", {
            description: result.message || "Failed to create budget."
        });
    }

  }

  return (
    <Empty className="border border-dashed from-muted/50 to-background h-full bg-gradient-to-b from-30% hover:shadow-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>Not a budget in sight :p</EmptyTitle>
        <EmptyDescription>  
          You haven&apos;t created any budgets yet. Create it to view your first budget.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          {isClient && (
          <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Create New Budget</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">Creating a Budget</DialogTitle>
            <DialogDescription className="pb-4">
              Select an icon, then input your budget name and amount. Then click the 'Create Budget' button to create it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5">
            <div className="grid gap-3">
              <Label htmlFor="amount">Select icon</Label>  
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} className="text-left justify-start text-gray-500 text-s font-normal">
                    {selectedEmoji ? (
                      // Tampilkan emoji jika sudah dipilih
                      <span className="text-2xl mr-2">{selectedEmoji}</span>
                    ) : (
                      // Tampilkan teks placeholder jika belum ada
                      <span className="text-muted-foreground">Press me to select</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full border-none">
                    <EmojiPicker 
                      height={350}
                      width="100%" 
                      onEmojiClick={handleEmojiClick} 
                    />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Budget Name</Label>
              <Input 
                  id="name" 
                  placeholder="Shopping, subscriptions, etc" 
                  value={name} // Binding value
                  onChange={(e) => setName(e.target.value)} // Update state
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                   id="amount" 
                  type="number" 
                  placeholder="Numbers only, counted as IDR" 
                  value={amount} // Binding value
                  onChange={(e) => setAmount(e.target.value)} // Update state
               />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isButtonDisabled}>
                {isLoading ? "Creating..." : "Create Budget"}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
    )}
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
      </Button>
    </Empty>
  )
}
