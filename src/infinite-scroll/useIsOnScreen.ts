import { useCallback, useState } from "react";

// Custom hook to detect if an element is in the viewport
const useIsOnScreen = ({
                           root = null, // The element that is used as the viewport for checking visibility
                           rootMargin = "0px", // Margin around the root
                           threshold = 0 // A threshold for when to trigger the observer
                       }: IntersectionObserverInit) => {
    const [observer, setObserver] = useState<IntersectionObserver | null>(null); // State to store the observer instance
    const [isIntersecting, setIntersecting] = useState(false); // State to track if the element is intersecting

    // The ref callback to attach to the element we want to observe
    const ref = useCallback(
        (node: any) => {
            if (node) {
                // Create a new IntersectionObserver instance
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        // Update the intersecting state based on the entry's visibility
                        setIntersecting(entry.isIntersecting);
                    },
                    { root, rootMargin, threshold } // Options for the observer
                );

                observer.observe(node); // Start observing the node
                setObserver(observer); // Save the observer instance to state
            }
        },
        [root, rootMargin, threshold] // Dependencies for the callback
    );

    return { ref, isIntersecting, observer }; // Return the ref callback, intersection status, and observer
};

export default useIsOnScreen;
