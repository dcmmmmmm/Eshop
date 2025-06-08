"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, ChevronsUpDown, Upload, X } from "lucide-react"
import { toast } from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

export default function NewBrandCategoryPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [brandId, setBrandId] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false)
  const router = useRouter()

  React.useEffect(() => {
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

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategories(current => {
      if (current.includes(categoryId)) {
        return current.filter(id => id !== categoryId)
      }
      return [...current, categoryId]
    })
  }

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(current => current.filter(id => id !== categoryId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên')
      return
    }
    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả')
      return
    }
    if (!brandId) {
      toast.error('Vui lòng chọn thương hiệu')
      return
    }
    if (selectedCategories.length === 0) {
      toast.error('Vui lòng chọn ít nhất một danh mục')
      return
    }

    const slug = generateSlug(name)
    setLoading(true)

    try {
      const promises = selectedCategories.map(categoryId => 
        fetch('/api/brand-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name, 
            description, 
            slug,
            brandId,
            categoryId
          }),
        })
      )

      const responses = await Promise.all(promises)
      const hasError = responses.some(res => !res.ok)

      if (hasError) {
        throw new Error('Có lỗi xảy ra khi tạo liên kết')
      }

      toast.success('Thêm mới thành công')
      router.push('/dashboard/brand-category')
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi tạo liên kết thương hiệu và danh mục')
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
            Thêm Mới Liên Kết Thương Hiệu - Danh Mục
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="categories" className="text-base">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Popover open={openCategoryPopover} onOpenChange={setOpenCategoryPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategoryPopover}
                    className="w-full justify-between h-11"
                  >
                    {selectedCategories.length > 0
                      ? `${selectedCategories.length} danh mục đã chọn`
                      : "Chọn danh mục"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Tìm danh mục..." />
                    <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          onSelect={() => handleSelectCategory(category.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCategories.includes(category.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map((categoryId) => {
                    const category = categories.find(c => c.id === categoryId)
                    return (
                      <Badge key={categoryId} variant="secondary" className="py-1">
                        {category?.name}
                        <button
                          type="button"
                          onClick={() => removeCategory(categoryId)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Tên liên kết <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên liên kết"
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
                placeholder="Nhập mô tả cho liên kết"
                className="min-h-[120px] resize-none"
              />
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