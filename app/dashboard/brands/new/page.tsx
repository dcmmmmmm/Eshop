'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { UploadDropzone } from '@/utils/uploadthing'
import Image from 'next/image'
import { ArrowLeft, Upload } from 'lucide-react'

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function NewBrandPage() {
  const [image, setImage] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên thương hiệu')
      return
    }
    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả thương hiệu')
      return
    }
    if (!image) {
      toast.error('Vui lòng tải lên ảnh thương hiệu')
      return
    }

    const slug = generateSlug(name)
    setLoading(true)
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, image, slug }),
      })

      if (res.ok) {
        toast.success('Thêm mới thương hiệu thành công')
        router.push('/dashboard/brands')
      } else {
        const error = await res.json()
        toast.error(error.message || 'Thêm mới không thành công')
      }
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi thêm thương hiệu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
          Quay lại
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Thêm Thương Hiệu Mới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Tên thương hiệu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên thương hiệu"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả về thương hiệu"
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base">
                Ảnh thương hiệu <span className="text-red-500">*</span>
              </Label>
              {image ? (
                <div className="relative">
                  <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt="Brand Image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setImage("")}
                  >
                    Đổi ảnh
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-4">
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: any) => {
                      if (res?.[0]?.url) {
                        setImage(res[0].url)
                        toast.success("Tải ảnh thành công")
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error(error)
                      toast.error("Tải ảnh thất bại")
                    }}
                  />
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Upload className="animate-spin" size={20} />
                    Đang xử lý...
                  </div>
                ) : (
                  "Thêm thương hiệu"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
