"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Brand {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
  status: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED"
  brandId: string
  categoryId: string
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function UpdateProductPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState(0)
  const [image, setImage] = useState("")
  const [status, setStatus] = useState<"AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED">("AVAILABLE")
  const [brandId, setBrandId] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch product data
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error('Không tìm thấy sản phẩm')
        }
        const data: Product = await response.json()
        setName(data.name)
        setDescription(data.description)
        setPrice(data.price.toString())
        setStock(data.stock.toString())
        setImage(data.image)
        setStatus(data.status)
        setBrandId(data.brandId)
        setCategoryId(data.categoryId)

        // Fetch brands and categories
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
        router.push('/dashboard/products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm')
      return
    }
    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả')
      return
    }
    if (!price || isNaN(Number(price))) {
      toast.error('Vui lòng nhập giá hợp lệ')
      return
    }
    if (!stock || isNaN(Number(stock))) {
      toast.error('Vui lòng nhập số lượng hợp lệ')
      return
    }
    if (!image) {
      toast.error('Vui lòng nhập URL hình ảnh')
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

    const slug = generateSlug(name)
    setLoading(true)

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          slug,
          price: Number(price),
          stock: Number(stock),
          image,
          status,
          brandId,
          categoryId,
        }),
      })

      if (response.ok) {
        toast.success('Cập nhật sản phẩm thành công')
        router.push('/dashboard/products')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Cập nhật sản phẩm thất bại')
      }
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm')
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
            Cập Nhật Sản Phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả sản phẩm"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Giá <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Nhập giá sản phẩm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">
                  Số lượng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Nhập số lượng"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">
                URL Hình ảnh <span className="text-red-500">*</span>
              </Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Nhập URL hình ảnh"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Trạng thái <span className="text-red-500">*</span>
              </Label>
              <Select value={status} onValueChange={(value: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED") => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Còn hàng</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
                  <SelectItem value="DISCONTINUED">Ngừng kinh doanh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">
                Thương hiệu <span className="text-red-500">*</span>
              </Label>
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger>
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
              <Label htmlFor="category">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Upload className="animate-spin" size={20} />
                  Đang xử lý...
                </div>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}