import Icon from '../../../components/AppIcon';


const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon name="Search" size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by customer name or bill ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
};

export default SearchBar;