---
title: Mandelbrot Set Rendering Engine
timestamp: 1698948603333
---

### Mandelbrot Set Rendering Engine

The Mandelbrot Set Rendering Engine is a web-based application I developed. This project explores the fascinating world of fractals, specifically the Mandelbrot Set, a set of complex numbers defined in the complex plane. The set is determined by iterating the function f<sub>c</sub>(z)=z<sup>2</sup>+c, with points that don't diverge to infinity considered part of the set. When the set is charted on a 2D plane representing the complex plane, the famous Mandelbrot Set image appears. 

![The Mandelbrot set fully zoomed out. The complex axis is rendered vertically and the origin is on the right where the two halves of the main cardioid meet](/mandelbrot-full-size.png)

The Mandelbrot Set's unparalleled intrigue lies in its utter lack of self-similarity as one delves into its intricate fringes. Unlike many other fractals, where patterns repeat on various scales, the Mandelbrot Set presents an ever-changing, infinitely complex terrain. As you zoom deeper, new structures emerge that bear no resemblance to the larger set, forming a mesmerizing tapestry of shapes, colors, and intricacies. This absence of repetitive motifs challenges our conventional understanding of geometry and mathematics, offering a profound glimpse into the boundless complexity of the natural world. The set's ability to constantly surprise and astonish, revealing new, uncharted realms with each level of magnification, underscores its enduring fascination for mathematicians, scientists, and enthusiasts alike. 

#### How it Works:

To visualize the Mandelbrot Set, the complex plane is mapped into an image. Each pixel's color represents the number of iterations required for the point to reach the escape boundary. If the point never escaped within a fixed number of iterations, it is assumed that it will never escape (and is thus part of the set). The number of iterations needed to provide an accurate basis for this assumption varies depending on the level of detail needed, but roughly 1000 iterations are sufficient to provide an accurate image for the fully zoomed out set. As detail and zoom level increases, more iterations are needed. 

#### For the Programmers:

*Mathematical Optimizations:*

One of the fundamental challenges in Mandelbrot Set rendering is translating the complex mathematical equation into a form that computers can efficiently process. This involves the refactoring and parsing both real and imaginary components of the complex number iterator, and precalculating squares to streamline the computation. Additionally, the introduction of the escape boundary, a circle around the origin with radius 2, drastically reduces computational load. Points lying outside this boundary are guaranteed to diverge towards infinity, enabling quick exclusion of non-set points and significantly speeding up the calculations. The mathematical optimizations amount to a final piece of code that is surprisingly concise that holds the entire algorithm needed to render this massive and complex fractal: 

```HLSL
loop {
    if !(zx2 + zy2 <= 4.0 && iteration < max_iteration)
    {
        break;
    }
    var xtemp : f32 = zx2 - zy2 + x0;
    y = 2 * x * y + y0;
    x = xtemp;
    zx2 = x * x;
    zy2 = y * y;
    iteration = iteration + 1;
}
```

*Programmatic Optimizations:*

Incorporating sophisticated programmatic optimizations, the rendering engine employs boundary checking strategies that involve dividing the Mandelbrot Set into distinct sections. By calculating the boundaries of these sections and determining whether the entire boundary lies within the set, the engine efficiently assesses the interior points. If the entire boundary is confirmed to be within the set, the engine assumes that the entire interior of the section shares the same characteristic. This intelligent approach drastically reduces computational workload by strategically curtailing unnecessary point evaluations, enhancing the overall efficiency of the rendering process.

*Meta-Optimizations:*

Incorporating advanced techniques, the rendering engine leverages GPU rendering and chunking to achieve remarkable speed and efficiency. By harnessing the parallel processing power of GPUs, the engine performs massively parallel computations, allowing each point to be calculated independently. This approach capitalizes on the GPU's ability to handle numerous calculations simultaneously, vastly outperforming traditional CPU-based computations. Additionally, chunking, the process of dividing the main image into regions and intelligently calculating only necessary points, optimizes the rendering process by avoiding unnecessary computations. While chunking offers significant computational savings, it does require careful consideration to maintain the integrity of the fractal's visual representation. These meta-optimizations combine cutting-edge technology and strategic algorithm design to create a Mandelbrot Set rendering engine that excels in both speed and accuracy.

The various optimizations drastically change the render time for each image of the set. While it can be difficult to quantify the realized difference because of hardware differences and a general lack uniformity in render times between various portions of the set, by applying the optimizations listed above, the render time can be taken from many 10s of seconds per image to less than 5 seconds per image on average PC hardware. 

#### Technology Used:

The application is implemented in HTML, JavaScript, and WebGPU Shading Language (WGSL). Bootstrap is utilized for styling, and communication with the GPU is facilitated through the WebGPU API.

