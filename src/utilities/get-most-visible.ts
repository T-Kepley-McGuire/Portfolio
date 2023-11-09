/**
 * Retrieves the element from the given array of elements that is closest to the centerline of the viewport.
 *
 * @param {Array<Element>} elements - An array of DOM elements to be evaluated.
 * @param {number} centerline - The centerline position on the page, represented as a decimal between 0 and 1 (default is 0.5).
 * @returns {Element} - The element in the array that is most visible near the centerline of the viewport.
 *
 * This function iterates through the provided array of DOM elements and calculates their visibility
 * relative to the specified centerline. It then returns the element that is closest to the centerline,
 * based on the percentage of its visibility in the viewport.
 */
export default function getMostVisible(elements: Array<Element>, centerline: number = 0.5): Element {
  let element: Element;
  const viewportHeight = window.innerHeight;
  let max = 0;

  elements.forEach((e) => {
    var visiblePx = mapVisiblityToRange(e, viewportHeight, centerline, map);

    if (visiblePx > max) {
      max = visiblePx;
      element = e;
    }
  });

  return elements.filter((e) => e === element)[0];
}

/**
 * Maps the visibility of a given DOM element relative to a specified centerline position to another range of values using a custom callback function.
 *
 * @param {Element} element - The DOM element whose visibility is to be calculated.
 * @param {number} viewportHeight - The height of the viewport in pixels.
 * @param {number} centerline - The centerline position on the page, represented as a decimal between 0 and 1.
 * @param {Function} mapper - A callback function that maps the closeness of the nearest point on the element to the centerline (ranging from 0 to 1) to another range of values.
 * @returns {number} - The mapped result obtained by applying the custom callback function to the closeness of the nearest point on the element to the specified centerline.
 *
 * This function determines the visibility of the input element in relation to the provided centerline position.
 * It calculates the percentage of the element's visibility in the viewport, represented as a value ranging from 0 to 1,
 * and uses the provided callback function to map this value to another range of values. The mapper function takes
 * one parameter: the closeness of the nearest point on the element to the specified centerline, ranging from 0 (closest)
 * to 1 (farthest).
 */
function mapVisiblityToRange(element: Element, viewportHeight: number, centerline: number, mapper: Function): number {
  const rect: DOMRect = element.getBoundingClientRect();

  const viewportMiddle = viewportHeight * centerline;

  if(rect.top < viewportMiddle && rect.bottom > viewportMiddle) {
    return mapper(0);
  } else if(rect.top < viewportMiddle && rect.bottom <= viewportMiddle) {
    return mapper((rect.bottom - viewportMiddle) / viewportMiddle);
  } else  {
    return mapper((rect.top - viewportMiddle) / viewportMiddle);
  }
}

/**
 * Maps the input value 'x' to a bell-shaped curve using a Gaussian function.
 *
 * @param {number} x - The input value to be mapped onto the bell-shaped curve.
 * @param {number} falloff - Controls the steepness of the curve (optional, default value: 2). Higher values result in a narrower and taller curve, while lower values produce a broader and shorter curve.
 * @returns {number} - The mapped output value, representing the position on the bell-shaped curve.
 *
 * This function applies a Gaussian function to the input value 'x' to create a bell-shaped curve.
 * The curve is centered at x = 0 and smoothly transitions from high values to low values based on the input's distance from the center.
 * The 'falloff' parameter adjusts the steepness of the curve; higher values create a narrower peak, while lower values result in a broader curve.
 * The function is useful for generating smooth transitions and gradual effects in various applications.
 */
function map(x: number, falloff: number = 2): number {
  return Math.pow(Math.pow(2, falloff), -falloff * x * x);
}
