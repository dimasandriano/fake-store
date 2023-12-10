'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ShoppingCart, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { NextImage } from '@/components/atoms/Nextimage';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/atoms/Toggle/toggle-group';
import { Typography } from '@/components/atoms/Typography';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/molecules/Card/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/organisms/Sheet/sheet';

import { useStore } from '@/store/store';

import { category } from '@/types/category.type';
import { product } from '@/types/product.type';
export default function Page() {
  const [open, setOpen] = useState(false);
  const [categoryProduct, setCategoryProduct] = useState('all');
  const { data: products, refetch: refetchProducts } = useQuery<product[]>({
    queryKey: ['getProducts'],
    queryFn: async () => {
      const res = await axios.get(
        `https://fakestoreapi.com/products${
          categoryProduct === 'all' ? '' : `/category/${categoryProduct}`
        }`,
      );
      return res.data;
    },
  });
  const { data: categories } = useQuery<category>({
    queryKey: ['getCategories'],
    queryFn: async () => {
      const res = await axios.get(
        'https://fakestoreapi.com/products/categories',
      );
      return res.data;
    },
  });

  const {
    cartItems,
    isOnCart,
    addToCart,
    removeFromCart,
    addQty,
    removeQty,
    total,
  } = useStore();

  useEffect(() => {
    if (categoryProduct) {
      refetchProducts();
    }
  }, [categoryProduct, refetchProducts]);
  return (
    <div>
      <nav className='shadow-md fixed top-0 left-0 right-0 bg-white z-10'>
        <div className='max-w-6xl w-full mx-auto py-3 flex justify-between items-center '>
          <Typography variant='h3'>Fake Store</Typography>
          <Button onClick={() => setOpen(true)} className='relative'>
            <ShoppingCart />
            <div className='absolute -top-2 border-2 -right-2 p-2 rounded-full w-3 h-3 flex justify-center items-center bg-white'>
              <Typography variant='c1'>{cartItems?.length}</Typography>
            </div>
          </Button>
        </div>
      </nav>

      <div className='max-w-6xl w-full mx-auto py-5 mt-16'>
        <ToggleGroup type='single' className='w-full justify-start mb-3'>
          <ToggleGroupItem
            value='all'
            onClick={() => setCategoryProduct('all')}
            disabled={categoryProduct === 'all'}
          >
            <Typography variant='h6'>All</Typography>
          </ToggleGroupItem>
          {categories?.map((category, index) => (
            <ToggleGroupItem
              value={category}
              key={index}
              onClick={() => setCategoryProduct(category)}
              disabled={category === categoryProduct}
            >
              <Typography variant='h6' className='capitalize'>
                {category}
              </Typography>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className='grid grid-cols-4 gap-5'>
          {products?.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className='text-xl truncate'>
                  {product?.title}
                </CardTitle>
                <CardDescription className='flex justify-center w-full h-[200px] items-center rounded-lg overflow-hidden group'>
                  <NextImage
                    src={product?.image}
                    alt={product?.title}
                    width={200}
                    height={200}
                    className='w-[150px] h-[150px] flex group-hover:scale-110 transition-all'
                  />
                </CardDescription>
              </CardHeader>
              <CardContent className='flex justify-between items-center'>
                <div className='flex gap-1 items-center'>
                  <Star fill='#f59e0b' color='#f59e0b' className='w-4' />
                  <Typography variant='c1'>{product?.rating?.rate}</Typography>
                </div>
                <Typography variant='c1'>$ {product?.price}</Typography>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={isOnCart(product.id)}
                  onClick={() => addToCart({ ...product, qty: 1 })}
                  className='w-full'
                >
                  {isOnCart(product.id) ? 'Added to cart' : 'Add to cart'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Cart Items ({cartItems?.length})</SheetTitle>
            <SheetDescription className='h-[90vh] relative'>
              <div className='h-[80vh] overflow-y-auto'>
                {cartItems?.map((item) => (
                  <div key={item.id} className='border-b p-3 relative'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <NextImage
                          src={item.image}
                          alt={item.title}
                          width={50}
                          height={50}
                          className='w-[50px] h-[50px]'
                        />
                        <div>
                          <Typography variant='b3'>
                            {item.title.slice(0, 30)}
                          </Typography>
                          <Typography variant='c1'>${item.price}</Typography>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center justify-end gap-3'>
                      <Button
                        disabled={item.qty === 1}
                        onClick={() => removeQty(item.id)}
                        className='w-8 h-8'
                      >
                        -
                      </Button>
                      <Typography
                        variant='h4'
                        className='w-4 flex justify-center'
                      >
                        {item.qty}
                      </Typography>
                      <Button
                        onClick={() => addQty(item.id)}
                        className='w-8 h-8'
                      >
                        +
                      </Button>
                    </div>
                    <div
                      className='absolute top-1 text-black right-0 bg-red-300 px-1 rounded flex justify-center items-center cursor-pointer'
                      onClick={() => removeFromCart(item.id)}
                    >
                      x
                    </div>
                  </div>
                ))}
              </div>
              <div className='absolute bottom-0 w-full'>
                <div className='flex justify-between items-center'>
                  <Typography variant='h4'>Total</Typography>
                  <Typography variant='h4'>${total()}</Typography>
                </div>
                <Button
                  className='w-full'
                  disabled={cartItems?.length === 0}
                  onClick={() => alert(JSON.stringify(cartItems, null, 2))}
                >
                  Bayar
                </Button>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
