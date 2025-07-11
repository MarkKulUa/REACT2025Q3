import React, { Component } from 'react';
import styles from './Header.module.css';

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
      <div className={styles.headerContainer}>
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
          placeholder="Search Pokemon..."
          disabled={this.props.isLoading}
          className={styles.searchInput}
        />
        <button
          onClick={this.handleSearch}
          disabled={this.props.isLoading}
          className={styles.searchButton}
        >
          {this.props.isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    );
  }
}

export default Header;
