import React from 'react';
import {Post} from "./posts.types";
import "./posts.css"



const PostItem = ({title,body}:Post) => {
    return (
        <div className="post">
            <h2>{title}</h2>
            <p className="post-body">
                {body}
            </p>
        </div>
    );
};

export default PostItem;