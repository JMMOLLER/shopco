import { db, Product } from "astro:db";

export default async function () {
  await db.insert(Product).values([
    {
      id: 1,
      title: "T-shirt with Tape Details",
      thumbnailUrl: "/imgs/t-shirt.webp",
      rating: 4.5,
      price: 120
    },
    {
      id: 2,
      title: "Skinny Fit Jeans",
      thumbnailUrl: "/imgs/fit-jeans.webp",
      rating: 3.5,
      discount: 20,
      price: 240
    },
    {
      id: 3,
      title: "Checkered Shirt",
      thumbnailUrl: "/imgs/checkered-shirt.webp",
      rating: 4.5,
      price: 180
    },
    {
      id: 4,
      title: "Sleeve Striped T-shirt",
      thumbnailUrl: "/imgs/striped-t-shirt.webp",
      rating: 4.5,
      discount: 30,
      price: 130
    },
    {
      id: 5,
      title: "Vertical Striped Shirt",
      thumbnailUrl: "/imgs/striped-shirt.webp",
      rating: 5,
      discount: 20,
      price: 212
    },
    {
      id: 6,
      title: "Courage Graphic T-shirt",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4,
      price: 145
    },
    {
      id: 7,
      title: "Loose Fit Bermuda Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3,
      price: 80
    },
    {
      id: 8,
      title: "Faded Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.5,
      price: 210
    },
    {
      id: 9,
      title: "Courage Graphic T-shirt",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4,
      price: 145
    },
    {
      id: 10,
      title: "Loose Fit Bermuda Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3,
      price: 80
    },
    {
      id: 11,
      title: "Faded Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.5,
      price: 210
    },
    {
      id: 12,
      title: "Graphic Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.3,
      price: 155
    },
    {
      id: 13,
      title: "Ripped Skinny Jeans",
      thumbnailUrl: "/imgs/fit-jeans.webp",
      rating: 3.8,
      discount: 10,
      price: 250
    },
    {
      id: 14,
      title: "Plaid Shirt",
      thumbnailUrl: "/imgs/checkered-shirt.webp",
      rating: 4.6,
      price: 190
    },
    {
      id: 15,
      title: "Striped Polo Shirt",
      thumbnailUrl: "/imgs/striped-t-shirt.webp",
      rating: 4.7,
      discount: 25,
      price: 140
    },
    {
      id: 16,
      title: "Patterned Shirt",
      thumbnailUrl: "/imgs/striped-shirt.webp",
      rating: 5,
      discount: 15,
      price: 220
    },
    {
      id: 17,
      title: "Motivational Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.2,
      price: 150
    },
    {
      id: 18,
      title: "Comfy Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.5,
      price: 85
    },
    {
      id: 19,
      title: "Classic Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.4,
      price: 220
    },
    {
      id: 20,
      title: "Inspirational Graphic T-shirt",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.1,
      price: 150
    },
    {
      id: 21,
      title: "Relaxed Fit Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.2,
      price: 75
    },
    {
      id: 22,
      title: "Vintage Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.7,
      price: 215
    },
    {
      id: 23,
      title: "Positive Vibes Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.3,
      price: 150
    },
    {
      id: 24,
      title: "Casual Bermuda Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.4,
      price: 70
    },
    {
      id: 25,
      title: "Denim Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.8,
      price: 225
    },
    {
      id: 26,
      title: "Cool Graphic Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4,
      price: 155
    },
    {
      id: 27,
      title: "Comfortable Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.1,
      price: 85
    },
    {
      id: 28,
      title: "Stretch Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.6,
      price: 230
    },
    {
      id: 29,
      title: "Stay Positive Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.4,
      price: 160
    },
    {
      id: 30,
      title: "Summer Bermuda Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.3,
      price: 90
    },
    {
      id: 31,
      title: "Ultimate Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.9,
      price: 220
    },
    {
      id: 32,
      title: "Positive Graphic Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.3,
      price: 160
    },
    {
      id: 33,
      title: "Chill Bermuda Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.6,
      price: 95
    },
    {
      id: 34,
      title: "Innovative Graphic Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.3,
      price: 158
    },
    {
      id: 35,
      title: "Trendy Skinny Jeans",
      thumbnailUrl: "/imgs/fit-jeans.webp",
      rating: 3.9,
      discount: 18,
      price: 235
    },
    {
      id: 36,
      title: "Elegant Checkered Shirt",
      thumbnailUrl: "/imgs/checkered-shirt.webp",
      rating: 4.8,
      price: 185
    },
    {
      id: 37,
      title: "Modern Striped T-shirt",
      thumbnailUrl: "/imgs/striped-t-shirt.webp",
      rating: 4.6,
      discount: 28,
      price: 125
    },
    {
      id: 38,
      title: "Classic Striped Shirt",
      thumbnailUrl: "/imgs/striped-shirt.webp",
      rating: 5,
      discount: 22,
      price: 218
    },
    {
      id: 39,
      title: "Bold Graphic T-shirt",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.1,
      price: 142
    },
    {
      id: 40,
      title: "Sporty Bermuda Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.3,
      price: 78
    },
    {
      id: 41,
      title: "Stylish Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.4,
      price: 205
    },
    {
      id: 42,
      title: "Heroic Graphic T-shirt",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.5,
      price: 150
    },
    {
      id: 43,
      title: "Casual Bermuda Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.1,
      price: 82
    },
    {
      id: 44,
      title: "Comfort Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.9,
      price: 212
    },
    {
      id: 45,
      title: "Graphic Tee Deluxe",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.3,
      price: 152
    },
    {
      id: 46,
      title: "Relaxed Fit Jeans",
      thumbnailUrl: "/imgs/fit-jeans.webp",
      rating: 4.0,
      discount: 15,
      price: 245
    },
    {
      id: 47,
      title: "Premium Checkered Shirt",
      thumbnailUrl: "/imgs/checkered-shirt.webp",
      rating: 4.7,
      price: 195
    },
    {
      id: 48,
      title: "Striped Tee",
      thumbnailUrl: "/imgs/striped-t-shirt.webp",
      rating: 4.5,
      discount: 20,
      price: 135
    },
    {
      id: 49,
      title: "Vertical Striped Tee",
      thumbnailUrl: "/imgs/striped-shirt.webp",
      rating: 5,
      discount: 17,
      price: 225
    },
    {
      id: 50,
      title: "Courageous Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.2,
      price: 148
    },
    {
      id: 51,
      title: "Bermuda Comfort Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.4,
      price: 77
    },
    {
      id: 52,
      title: "Classic Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.8,
      price: 230
    },
    {
      id: 53,
      title: "Stylish Graphic T-shirt",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.3,
      price: 145
    },
    {
      id: 54,
      title: "Bermuda Fit Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.2,
      price: 83
    },
    {
      id: 55,
      title: "Faded Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.7,
      price: 220
    },
    {
      id: 56,
      title: "Courageous Graphic Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.4,
      price: 160
    },
    {
      id: 57,
      title: "Summer Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.5,
      price: 90
    },
    {
      id: 58,
      title: "Vintage Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.8,
      price: 215
    },
    {
      id: 59,
      title: "Bold Graphic Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.5,
      price: 150
    },
    {
      id: 60,
      title: "Chill Bermuda Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.1,
      price: 72
    },
    {
      id: 61,
      title: "Ultimate Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.9,
      price: 240
    },
    {
      id: 62,
      title: "Positive Vibes Graphic Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.3,
      price: 160
    },
    {
      id: 63,
      title: "Chill Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.6,
      price: 88
    },
    {
      id: 64,
      title: "Stretch Skinny Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.6,
      price: 230
    },
    {
      id: 65,
      title: "Cool Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.4,
      price: 154
    },
    {
      id: 66,
      title: "Light Bermuda Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.4,
      price: 95
    },
    {
      id: 67,
      title: "Fashionable Graphic Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.2,
      price: 150
    },
    {
      id: 68,
      title: "Slim Fit Jeans",
      thumbnailUrl: "/imgs/fit-jeans.webp",
      rating: 4.1,
      discount: 15,
      price: 240
    },
    {
      id: 69,
      title: "Stylish Checkered Shirt",
      thumbnailUrl: "/imgs/checkered-shirt.webp",
      rating: 4.6,
      price: 190
    },
    {
      id: 70,
      title: "Striped Long Sleeve T-shirt",
      thumbnailUrl: "/imgs/striped-t-shirt.webp",
      rating: 4.8,
      discount: 30,
      price: 135
    },
    {
      id: 71,
      title: "Casual Striped Shirt",
      thumbnailUrl: "/imgs/striped-shirt.webp",
      rating: 5,
      discount: 25,
      price: 210
    },
    {
      id: 72,
      title: "Courage Graphic Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.5,
      price: 155
    },
    {
      id: 73,
      title: "Bermuda Denim Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.7,
      price: 80
    },
    {
      id: 74,
      title: "Skinny Fit Denim Jeans",
      thumbnailUrl: "/imgs/skinny-jeans.webp",
      rating: 4.6,
      price: 210
    },
    {
      id: 75,
      title: "Inspirational Graphic Tee",
      thumbnailUrl: "/imgs/courage-t-shirt.webp",
      rating: 4.4,
      price: 145
    },
    {
      id: 76,
      title: "Comfy Bermuda Shorts",
      thumbnailUrl: "/imgs/bermuda-shorts.webp",
      rating: 3.4,
      price: 85
    }
  ]);
}
