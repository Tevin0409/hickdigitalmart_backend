// src/dto/product.ts

// Product DTOs
export interface CreateProductDTO {
  name: string;
  subCategoryId: string;
  models: {
    name: string;
    description?: string;
    price: number;
    minimumStock: number;
    features: {
      description: string;
    }[];
    inventory: {
      quantity: number;
    };
  }[];
}


export interface UpdateProductDTO {
  name?: string;
  subCategoryId?: string;
  features?: { description: string }[];
}

// Category DTOs
export interface CreateCategoryDTO {
  name: string;
}

export interface UpdateCategoryDTO {
  name?: string;
}

// Subcategory DTOs
export interface CreateSubCategoryDTO {
  name: string;
  categoryId: string;
}

export interface UpdateSubCategoryDTO {
  name?: string;
  categoryId?: string;
}
