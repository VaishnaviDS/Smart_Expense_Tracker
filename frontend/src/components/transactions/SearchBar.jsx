import "./transaction.css";

function SearchBar({ search, setSearch }) {

  return (
   <div className="transaction-search-bar">
      <input
        type="text"
        placeholder="Search by party..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;