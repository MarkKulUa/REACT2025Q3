import React, { Component } from 'react';

interface HeaderState {
  searchTerm: string;
}

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  isLoading: boolean;
}

class Header extends Component<HeaderProps, HeaderState> {
  private readonly STORAGE_KEY = 'pokemon-search-term';

  constructor(props: HeaderProps) {
    super(props);

    // Load search term from localStorage
    const savedSearchTerm = localStorage.getItem(this.STORAGE_KEY) || '';

    this.state = {
      searchTerm: savedSearchTerm,
    };
  }

  componentDidMount(): void {
    // Trigger initial search with saved term
    this.props.onSearch(this.state.searchTerm);
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      searchTerm: event.target.value,
    });
  };

  handleSearch = (): void => {
    const trimmedSearchTerm = this.state.searchTerm.trim();

    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, trimmedSearchTerm);

    // Trigger search
    this.props.onSearch(trimmedSearchTerm);
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  };

  render(): React.ReactNode {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
          placeholder="Search Pokemon..."
          disabled={this.props.isLoading}
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            width: '300px',
            outline: 'none',
          }}
        />
        <button
          onClick={this.handleSearch}
          disabled={this.props.isLoading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: this.props.isLoading ? 'not-allowed' : 'pointer',
            opacity: this.props.isLoading ? 0.6 : 1,
          }}
        >
          {this.props.isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    );
  }
}

export default Header;
