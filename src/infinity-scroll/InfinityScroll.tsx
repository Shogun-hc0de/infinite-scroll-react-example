import React, { useEffect, useState } from 'react';
import useIsOnScreen from './useIsOnScreen';

// Define the props for the InfinityScroll component
type Props = Omit<IntersectionObserverInit, 'root'> & {
    children?: React.ReactNode; // The child elements to render
    hasMore: boolean; // Flag to indicate if more items are available to load
    fetchCallback: () => Promise<any>; // Callback to fetch more items
    loader?: React.ReactNode; // Optional loader element to display while fetching
};

const InfinityScroll = ({
                            rootMargin,
                            threshold,
                            children,
                            loader,
                            fetchCallback,
                            hasMore,
                        }: Props) => {
    const { ref, isIntersecting, observer } = useIsOnScreen({
        threshold,
        rootMargin,
    });
    const [isLoading, setIsLoading] = useState(false); // State to manage loading status

    useEffect(() => {
        // Effect to handle fetching more items when the last element is in view
        if (isIntersecting && hasMore && !isLoading) {
            setIsLoading(true); // Set loading state to true
            fetchCallback?.().then(() => {
                setIsLoading(false); // Reset loading state after fetching
                observer?.disconnect(); // Disconnect the observer after fetching
            });
        }

        // Cleanup function to disconnect the observer when the component unmounts or dependencies change
        return () => {
            observer?.disconnect();
        };
    }, [hasMore, isIntersecting, fetchCallback, observer]);

    return (
        <>
            {React.Children.map(children, (child:any, index:number) => {
                const isLast = React.Children.count(children) - 1 === index; // Check if the current child is the last one
                return (
                    <div ref={isLast ? ref : null}> {/* Attach ref only to the last child */}
                        {React.cloneElement(child)} {/* Clone and render the child element */}
                    </div>
                );
            })}
            {isLoading && loader && <div>{loader}</div>} {/* Show loader if loading */}
        </>
    );
};

export default InfinityScroll;
