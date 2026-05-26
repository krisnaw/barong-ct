import {EventCategoryType} from "@/db/schema";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {formatMoney} from "@/utils/money-helper";
import {EditCategory} from "@/components/category/edit-category";
import {DeleteCategory} from "@/components/category/delete-category";

export async function ListCategory({categories} : {categories: EventCategoryType[]}) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Desc</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category: EventCategoryType) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                {category.description}
              </TableCell>
              <TableCell>{category.price ? formatMoney(category.price) : 0}</TableCell>
              <TableCell>{category.serviceFee ? formatMoney(category.serviceFee) : 0}</TableCell>
              <TableCell className="text-right">
                <EditCategory category={category} />
                <DeleteCategory category={category} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}