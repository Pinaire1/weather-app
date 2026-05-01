function SearchBar({ city, setCity, handleSearch }) {
  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        placeholder="Enter a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;