export interface MenuItem {
  id: number;
  title: string;
  path?: string;
  icon?: any; // 放宽 icon 类型
  active?: boolean;
  dot?: string | boolean;
  badge?: string;
  children?: MenuItem[]; // 确保这是数组类型
}
