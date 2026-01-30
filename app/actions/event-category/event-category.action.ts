'use server'

import {revalidatePath} from "next/cache";

export async function createCategoryAction() : Promise<void> {

  console.log('Creating new category');

  revalidatePath('/', 'page')

}