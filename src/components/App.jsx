import React, {useState, useEffect} from 'react';
import { getAPI } from '../pixabay-api.js';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import toast, { Toaster } from 'react-hot-toast';


export const App = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isError, setisError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      // if no search input, return
      if(!searchQuery) return;
      
      setisLoading(true);
      setisError(false);

      try {
        const response = await getAPI(searchQuery, currentPage);
        const { totalHits, hits } = response;
        
        setImages(prevState => [...prevState, ...hits]);
        setIsEnd(currentPage * 12 >= totalHits);

        if(hits.length===0) {
          toast.error("No images found. Try a different search.");
          
          return;
        }
        
      } catch (error) {
        setisError(true);
        toast.error(`An error occurred while fetching data: ${error}`)
        return;
      }
      finally {
        setisLoading(false);
      }
    }

    fetchImages();
  },[searchQuery,currentPage])
  
  const handleSearchSubmit =(query) => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCurrentQuery = searchQuery.toLowerCase();
    if(normalizedQuery==='') {
      toast(`Empty string is not a valid search query. Please type again.`)
      return;
    }
    if (normalizedQuery === normalizedCurrentQuery) {
      toast(
        `Search query is the same as the previous one. Please provide a new search query.`
      );
      return;
    }
    if(normalizedQuery!==normalizedCurrentQuery) {
      setSearchQuery(normalizedQuery);
      setCurrentPage(1);
      setImages([]);
      setIsEnd(false);
    }
  }
    
  const handleLoadMore = () => {
  if (isEnd) {
    toast(`You've reached the end of the search results.`);
  }
  else {
      setCurrentPage(currentPage+1);
    }
  }

  return (
    <>
      <Toaster/>
      <SearchBar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} />
      {isLoading && <Loader />}
      {!isLoading && !isError && images.length > 0 && !isEnd && (
        <Button onClick={handleLoadMore} />
      )}
      {isError && <p>Something went wrong. Please try again later.</p>}
    </>
  )
}