/**
 * Boilerplate click-event counter utility provided by Vite's initial vanilla template.
 * Attaches a stateful click listener to a DOM node and updates its rendered text content.
 * 
 * Reference: Vite Default Vanilla JavaScript Template (Vite, 2026).
 *
 * @param {HTMLButtonElement | HTMLElement} element - The target DOM container or button.
 */
export function setupCounter(element) {
  // Track click state count locally within closure
  let counter = 0;

  // Helper function to update internal count and DOM text display
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `Count is ${counter}`;
  };

  // Increment counter on each user click event
  element.addEventListener('click', () => setCounter(counter + 1));

  // Initialize display count to 0 on mount
  setCounter(0);
}