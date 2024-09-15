export default interface CategoryDto {
    id: number;
    name: string;
    parentId: number | null;
    children?: CategoryDto[];
}