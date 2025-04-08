
import {
  Component,
  signal,
  computed,
  effect,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
  query = '';
  suggestions: string[] = [];
  highlightedIndex = -1; // ✅ New: to track which suggestion is active

  private destroy$ = new Subject<void>();
  private inputSubject = new Subject<string>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(query => {
        this.query = query;
        this.searchSuggestions();
      });
  }

  onSearchInput(query: string) {
    this.inputSubject.next(query);
    this.highlightedIndex = -1; // reset highlight on new input
  }

  searchSuggestions() {
    if (!this.query.trim()) {
      this.suggestions = [];
      return;
    }

    const apiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${encodeURIComponent(this.query)}`;

    this.http.get<any>(apiUrl).subscribe(response => {
      this.suggestions = response[1];
    });
  }

  selectSuggestion(suggestion: string) {
    this.query = suggestion;
    this.suggestions = [];
    this.highlightedIndex = -1;
  }

  onKeyDown(event: KeyboardEvent) {
    const maxIndex = this.suggestions.length - 1;

    if (event.key === 'ArrowDown') {
      this.highlightedIndex = this.highlightedIndex < maxIndex ? this.highlightedIndex + 1 : 0;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.highlightedIndex = this.highlightedIndex > 0 ? this.highlightedIndex - 1 : maxIndex;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (this.highlightedIndex >= 0) {
        this.selectSuggestion(this.suggestions[this.highlightedIndex]);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isDarkMode = false; // ✅ dark mode flag

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }
  1 = false;

  toggleDarkMode1() {
    this.isDarkMode = !this.isDarkMode;
  }


  // query: string = '';

  // selectSuggestion(suggestion: string) {
  //   this.query = suggestion;
  //   this.redirectToSearch(suggestion);
  // }

  redirectToSearch(query: string, id: number) {
    const encodedQuery = encodeURIComponent(query);
    // const url = `https://www.google.com/search?q=${encodedQuery}`;
    let url = `https://en.wikipedia.org/wiki/${encodedQuery}`;
    if (id == 1) {
      url = `https://en.wikipedia.org/wiki/${encodedQuery}`;
    } else {
      url = `https://www.google.com/search?q=${encodedQuery}`;
    }
    window.open(url, '_blank'); // open in new tab
  }


}


