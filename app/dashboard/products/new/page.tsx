"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UploadDropzone } from "@/utils/uploadthing"
import Image from "next/image"
import dynamic from "next/dynamic"
import "suneditor/dist/css/suneditor.min.css"

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full animate-pulse bg-gray-100 rounded-lg" />,
})

interface Brand {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}



export default function NewProductPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [technicalSpecifications, setTechnicalSpecifications] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [brandId, setBrandId] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const handleDesEditorChange = (content: string) => {
    setDescription(content)
  }
  const handleSpecEditorChange = (content: string) => {
    setTechnicalSpecifications(content)
  }
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [brandsRes, categoriesRes] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/categories')
        ])

        if (!brandsRes.ok || !categoriesRes.ok) {
          throw new Error('Lỗi khi tải dữ liệu')
        }

        const [brandsData, categoriesData] = await Promise.all([
          brandsRes.json(),
          categoriesRes.json()
        ])

        setBrands(brandsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
        toast.error('Có lỗi xảy ra khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm')
      return
    }
    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả sản phẩm')
      return
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error('Vui lòng nhập giá hợp lệ')
      return
    }
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      toast.error('Vui lòng nhập số lượng hợp lệ')
      return
    }
    if (!brandId) {
      toast.error('Vui lòng chọn thương hiệu')
      return
    }
    if (!categoryId) {
      toast.error('Vui lòng chọn danh mục')
      return
    }
    if (!image) {
      toast.error('Vui lòng tải lên ảnh sản phẩm')
      return
    }

    const slug = generateSlug(name)
    setLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          technicalSpecifications,
          price: Number(price),
          stock: Number(stock),
          brandId,
          categoryId,
          image,
          slug,
          status: 'AVAILABLE' // Thêm trạng thái mặc định
        }),
      })

      if (response.ok) {
        console.log(response)
        toast.success('Thêm sản phẩm thành công')
        router.push('/dashboard/products')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Thêm sản phẩm thất bại')
      }
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi thêm sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
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
            Thêm Mới Sản Phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Tên sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên sản phẩm"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <SunEditor
                setContents={description}
                onChange={handleDesEditorChange}
                setOptions={{
                  height: 'auto',
                  minHeight: '400px',
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize"],
                    ["bold", "underline", "italic", "strike"],
                    ["fontColor", "hiliteColor"],
                    ["align", "list", "lineHeight"],
                    ["table", "link", "image"],
                    ["preview", "print"],
                    ["removeFormat"]
                  ],
                  formats: ["p", "h1", "h2", "h3"],
                  font: ["Arial", "Helvetica", "sans-serif"]
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technicalSpecifications" className="text-base">
                Thông số kỹ thuật
              </Label>
              <SunEditor
                setContents={technicalSpecifications}
                onChange={handleSpecEditorChange}
                setOptions={{
                  height: 'auto',
                  minHeight: '400px',
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize"],
                    ["bold", "underline", "italic", "strike"],
                    ["fontColor", "hiliteColor"],
                    ["align", "list", "lineHeight"],
                    ["table", "link", "image"],
                    ["preview", "print"],
                    ["removeFormat"]
                  ],
                  formats: ["p", "h1", "h2", "h3"],
                  font: ["Arial", "Helvetica", "sans-serif"]
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-base">
                  Giá <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Nhập giá sản phẩm"
                  className="h-11"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-base">
                  Số lượng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Nhập số lượng"
                  className="h-11"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-base">
                  Thương hiệu <span className="text-red-500">*</span>
                </Label>
                <Select value={brandId} onValueChange={setBrandId}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-base">
                  Danh mục <span className="text-red-500">*</span>
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">
                Ảnh sản phẩm <span className="text-red-500">*</span>
              </Label>
              {image ? (
                <div className="relative">
                  <Image
                    src={image}
                    width={200}
                    height={200}
                    alt="Product Image"
                    className="w-full h-[200px] object-cover rounded-lg"
                  />
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                  "Thêm mới"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
