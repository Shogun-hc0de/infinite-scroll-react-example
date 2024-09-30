import React, { useEffect, useState } from 'react';
import InfinityScroll from "./infinity-scroll/InfinityScroll"; // Import the InfinityScroll component
import { Post } from "./posts/posts.types"; // Import the Post type for type safety
import PostItem from "./posts/PostItem"; // Import the PostItem component
import Loader from "./loader/Loader"; // Import a Loader component for loading state

// Define the structure of the pageable state
type Page = {
    page: number;
    hasMore: boolean;
    posts: Post[];
}

const LIMIT = 10; // Limit for the number of pages to fetch

// Utility function to simulate network delay
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function App() {
    // State to manage posts, pagination, and loading status
    const [pageable, setPageable] = useState<Page>({
        page: 1,
        hasMore: true,
        posts: []
    });

    // Fetch posts from the API
    const fetchPosts = async () => {
        await sleep(1250); // Simulate a network delay
        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageable.page}&_limit=10`);

            if (res.ok) {
                const json = await res.json();
                // Update the state with new posts and pagination info
                setPageable((prev: Page) => {
                    const nextPage = prev.page + 1; // Increment the page number
                    return {
                        hasMore: nextPage <= LIMIT, // Check if there are more pages to fetch
                        page: nextPage,
                        posts: [...prev.posts, ...json] // Append new posts to the existing array
                    };
                });
            }
        } catch (e) {
            console.error(e); // Log any errors during fetching
        }
    }

    // Effect to fetch posts on component mount
    useEffect(() => {
        fetchPosts(); // Initial fetch
    }, []);

    return (
        <div className="App">
            <div className="container">
                <InfinityScroll fetchCallback={fetchPosts} hasMore={pageable.hasMore} loader={<Loader />}>
                    {/* Map over posts and render each PostItem */}
                    {pageable.posts.map((post: Post) => <PostItem key={post.id} {...post} />)}
                </InfinityScroll>
            </div>
        </div>
    );
}

export default App; // Export the App component
