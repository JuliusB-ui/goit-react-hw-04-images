import React from 'react';
import { getAPI } from '../pixabay-api.js';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import { Component } from 'react';

// const App = () => {
//   const [images, setImages] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setisLoading] = useState(false);
//   const [isError, setisError] = useState(false);
//   const [isEnd, setIsEnd] = useState(false);

//   useEffect(() = {
//     const fetchImages = async () => {
//       if (!searchQuery) return;

//       setisLoading(true);
//       setisError(false);

//       try {
//         const response = await getAPI(searchQuery, currentPage);
//         const { totalHits, hits } = response;

//         this.setState(prevState => ({
//           images: currentPage === 1 ? hits : [...prevState.images, ...hits],
//           isLoading: false,
//           isEnd: prevState.images.length + hits.length >= totalHits,
//         }));

//         if (hits.length === 0) {
//           alert('No images found. Try a different search.');
//           return;
//         }
//       } catch (error) {
//         this.setState({ isLoading: false, isError: true });
//         alert(`An error occurred while fetching data: ${error}`);
//       }
//     }
//   }, [])

//   return (
//     <div>
//         <SearchBar onSubmit={handleSearchSubmit} />
//         <ImageGallery images={images} />
//         {isLoading && <Loader />}
//         {!isLoading && !isError && images.length > 0 && !isEnd && (
//           <Button onClick={handleLoadMore} />
//         )}
//         {isError && <p>Something went wrong. Please try again later.</p>}
//       </div>
//   )
// };

export class App extends Component {
  state = {
    images: [],
    currentPage: 1,
    searchQuery: '',
    isLoading: false,
    isError: false,
    isEnd: false,
  };

  async componentDidUpdate(_prevProps, prevState) {
    const { searchQuery, currentPage } = this.state;

    if (
      prevState.searchQuery !== searchQuery ||
      prevState.currentPage !== currentPage
    ) {
      await this.fetchImages();
    }
  }

  fetchImages = async () => {
    this.setState({ isLoading: true, isError: false });

    const { searchQuery, currentPage } = this.state;

    try {
      const response = await getAPI(searchQuery, currentPage);
      const { totalHits, hits } = response;

      this.setState(prevState => ({
        images: currentPage === 1 ? hits : [...prevState.images, ...hits],
        isLoading: false,
        isEnd: prevState.images.length + hits.length >= totalHits,
      }));

      if (hits.length === 0) {
        alert('No images found. Try a different search.');
        return;
      }
    } catch (error) {
      this.setState({ isLoading: false, isError: true });
      alert(`An error occurred while fetching data: ${error}`);
    }
  };

  handleSearchSubmit = query => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCurrentQuery = this.state.searchQuery.toLowerCase();

    if (normalizedQuery === '') {
      alert(`Empty string is not a valid search query. Please type again.`);
      return;
    }

    if (normalizedQuery === normalizedCurrentQuery) {
      alert(
        `Search query is the same as the previous one. Please provide a new search query.`
      );
      return;
    }

    // Only update the state and fetch images if the new query is different
    if (normalizedQuery !== normalizedCurrentQuery) {
      this.setState({
        searchQuery: normalizedQuery,
        currentPage: 1,
        images: [],
        isEnd: false,
      });
    }
  };

  handleLoadMore = () => {
    if (!this.state.isEnd) {
      this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
    } else {
      alert("You've reached the end of the search results.");
    }
  };

  render() {
    const { images, isLoading, isError, isEnd } = this.state;
    return (
      <div>
        <SearchBar onSubmit={this.handleSearchSubmit} />
        <ImageGallery images={images} />
        {isLoading && <Loader />}
        {!isLoading && !isError && images.length > 0 && !isEnd && (
          <Button onClick={this.handleLoadMore} />
        )}
        {isError && <p>Something went wrong. Please try again later.</p>}
      </div>
    );
  }
}
