'use client'

import React, { useEffect, useState } from 'react'
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

interface CategoryData {
  id: string
  name: string
  description: string
  image: string
  slug: string
}

export default function UpdateCategoryPage({ params }: { params: { id: string } }) {
  const [image, setImage] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await fetch(`/api/brands/${params.id}`)
        if (!response.ok) {
          throw new Error('Không tìm thấy thương hiệu')
        }
        const data: CategoryData = await response.json()
        setName(data.name)
        setDescription(data.description)
        setImage(data.image)
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
        toast.error('Không thể tải thông tin thương hiệu')
        router.push('/dashboard/brands')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchBrandData()
  }, [params.id, router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên ')
      return
    }
    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả ')
      return
    }
    if (!image) {
      toast.error('Vui lòng tải lên ảnh ')
      return
    }

    const slug = generateSlug(name)
    setLoading(true)
    try {
      const res = await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: params.id,
          name, 
          description, 
          image, 
          slug 
        }),
      })

      if (res.ok) {
        toast.success('Cập nhật thương hiệu thành công')
        router.push('/dashboard/categories')
      } else {
        const error = await res.json()
        toast.error(error.message || 'Cập nhật không thành công')
      }
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi cập nhật thương hiệu')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
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
            Cập Nhật Danh mục
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Tên Danh mục <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên Danh mục"
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
                placeholder="Nhập mô tả về Danh mục"
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base">
                Ảnh Danh mục <span className="text-red-500">*</span>
              </Label>
              {image ? (
                <div className="relative">
                  <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt="Category Image"
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
                  "Cập nhật Danh mục"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}