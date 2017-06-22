import { Category } from './category';
import { CssClasses } from './css-classes';
/**
 * Created by bodansky-apertus on 2017.06.22..
 */

export interface Todo {
    id: number;
    title: string;
    url: string;
    linkName: string;
    description: string;
    time: string;
    finished: boolean;
    category: Category;
    cssClasses: CssClasses;
}