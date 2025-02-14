// src/components/HootDetails/HootDetails.jsx
import { useParams, Link } from 'react-router-dom';
// src/components/HootDetails/HootDetails.jsx

import { useState, useEffect } from 'react';
import * as hootService from '../../services/hootService';
import CommentForm from '../CommentForm/CommentForm';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';

const HootDetails = (props) => {

    const { hootId } = useParams();
    console.log('hootId', hootId);

    // Access the user object from the UserContext
    const { user } = useContext(UserContext);
    const [hoot, setHoot] = useState(null);

    useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId);
      setHoot(hootData);
        };
        fetchHoot();
    }, [hootId]);

  // Verify the hoot state is set correctly:
    console.log('hoot state:', hoot);


  const handleAddComment = async (commentFormData) => {
    const newComment = await hootService.createComment(hootId, commentFormData);
    setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
  };

  const handleDeleteComment = async (hootId, commentId) => {
    console.log('commentId:', commentId);
    const deletedComment = await hootService.deleteComment(hootId, commentId);
    // Eventually, the service function will be called here
    setHoot({
      ...hoot,
      comments: hoot.comments.filter((comment) => comment._id !== commentId),
    });
  };

    if (!hoot) return <main>Loading...</main>;

    return (
    <main>
      <section>
        <header>
          <p>{hoot.category?.toUpperCase()}</p>
          <h1>{hoot.title}</h1>
          <p>
            {`${hoot.author?.username} posted on
            ${new Date(hoot.createdAt).toLocaleDateString()}`}
          </p>
          {hoot.author?._id === user?._id && (
              <>
                <Link to={`/hoots/${hootId}/edit`}>Edit</Link>
                <button onClick={() => props.handleDeleteHoot(hootId)}>Delete Hoot</button>
              </>
            )}
        </header>
        <p>{hoot.text}</p>
      </section>
      <section>
        <h2>Comments</h2>
        <CommentForm handleAddComment={handleAddComment} />
        {!hoot.comments.length && <p>There are no comments.</p>}

        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {`${comment.author.username} posted on
                ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
              {comment.author._id === user._id && (
                                <button onClick={() => handleDeleteComment(hootId, comment._id)}>
                                    Delete Comment
                                </button>
              )}
            </header>
            <p>{comment.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
  
  export default HootDetails;
  