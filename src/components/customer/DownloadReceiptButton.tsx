"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DownloadReceiptButtonProps {
  bookingId: string
}

export function DownloadReceiptButton({ bookingId }: DownloadReceiptButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Fetch the receipt data
      const response = await fetch(`/api/bookings/${bookingId}/receipt`)
      
      if (!response.ok) {
        throw new Error("Failed to generate receipt")
      }

      // Get the blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `TMT-Receipt-${bookingId.slice(0, 8)}.pdf`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading receipt:", error)
      alert("Failed to download receipt. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex-1 bg-brand-gold-500 hover:bg-brand-gold-600 text-black font-semibold"
    >
      <Download className="w-4 h-4 mr-2" />
      {isDownloading ? "Generating..." : "Download Receipt"}
    </Button>
  )
}