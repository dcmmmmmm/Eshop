"use client"

import { useEffect, useState } from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface Order {
  id: string
  createdAt: Date
  status: "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED"
  total: number
  customerName: string
  recipientName: string
  recipientPhone: string
  shippingAddress: string
  shippingMethod: string
  paymentMethod: string
  items: {
    name: string
    price: number
    quantity: number
  }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // Fetch dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
        toast.error('Không thể tải danh sách đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi cập nhật trạng thái')
      }
  
      // Cập nhật state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ))
  
      toast.success('Cập nhật trạng thái thành công')
    } catch (error) {
      console.error('Lỗi:', error)
      toast.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái')
    }
  }

  // Định nghĩa kiểu dữ liệu cho column
  type Column = {
    getIsSorted: () => boolean | "asc" | "desc";
    toggleSorting: (ascending: boolean) => void;
  }
  
  // Định nghĩa các cột
  const columns = [
    {
      accessorKey: "id",
      header: "Mã đơn hàng",
      cell: ({ row }: { row: Row }) => <div className="font-medium">{row.getValue("id")}</div>
    },
    {
      accessorKey: "createdAt",
      header: ({ column }: { column: Column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ngày đặt
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }: { row: Row }) => format(new Date(row.getValue("createdAt")), "PPpp", { locale: vi })
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const statusMap: { [key: string]: { label: string; color: string } } = {
          PENDING: { label: "Chờ xử lý", color: "bg-yellow-500" },
          PROCESSING: { label: "Đang xử lý", color: "bg-blue-500" },
          SHIPPING: { label: "Đang giao", color: "bg-purple-500" },
          DELIVERED: { label: "Đã giao", color: "bg-green-500" },
          CANCELLED: { label: "Đã hủy", color: "bg-red-500" }
        }
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Badge className={`${statusMap[status].color} text-white cursor-pointer`}>
                {statusMap[status].label}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.entries(statusMap).map(([value, { label }]) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => handleUpdateStatus(row.getValue("id"), value as Order['status'])}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    },
    {
      accessorKey: "total",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tổng tiền
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total"))
        const formatted = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND"
        }).format(amount)
        return formatted
      }
    },
    {
      accessorKey: "recipientName",
      header: "Tên người nhận"
    },
    {
      accessorKey: "recipientPhone",
      header: "SĐT người nhận"
    },
    {
      accessorKey: "shippingAddress",
      header: "Địa chỉ giao hàng"
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              {order.status === "PENDING" && (
                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "PROCESSING")}>
                  Xác nhận đơn hàng
                </DropdownMenuItem>
              )}
              {order.status === "PROCESSING" && (
                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "SHIPPING")}>
                  Bắt đầu giao hàng
                </DropdownMenuItem>
              )}
              {order.status === "SHIPPING" && (
                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "DELIVERED")}>
                  Xác nhận đã giao
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => {
                navigator.clipboard.writeText(order.id)
                toast.success("Đã sao chép mã đơn hàng")
              }}>
                Sao chép mã đơn hàng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return <div className="flex items-center justify-center h-full">Đang tải...</div>
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Tìm kiếm đơn hàng..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Cột hiển thị <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có đơn hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} / {" "}
          {table.getFilteredRowModel().rows.length} dòng được chọn.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}