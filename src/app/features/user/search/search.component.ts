import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { SearchService, FilterRequest, Filter } from '../../../core/services/search.service';
import { Tutor } from '../../../shared/models/tutor.model';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  filteredTutors: Tutor[] = [];
  filters = {
    bio: '',
    rating: null as number | null,
    hourlyRate: null as number | null,
    experienceYears: null as number | null,
    totalReviews: null as number | null,
    acceptsOneToMany: null as boolean | null
  };

  constructor(private searchService: SearchService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      const key = params['key'];
      if (key) {
        this.initSearch(key);
      }
    });
  }



  search(): void {
    const filterList: Filter[] = [];

    if (this.filters.bio) {
      filterList.push({ columnName: 'bio', operation: 'LIKE', value: this.filters.bio });
    }
    if (this.filters.rating !== null) {
      filterList.push({ columnName: 'rating', operation: 'GREATER_THAN_EQUAL', value: this.filters.rating });
    }
    if (this.filters.hourlyRate !== null) {
      filterList.push({ columnName: 'hourlyRate', operation: 'LESS_THAN_EQUAL', value: this.filters.hourlyRate });
    }
    if (this.filters.experienceYears !== null) {
      filterList.push({ columnName: 'experienceYears', operation: 'GREATER_THAN_EQUAL', value: this.filters.experienceYears });
    }
    if (this.filters.totalReviews !== null) {
      filterList.push({ columnName: 'totalReviews', operation: 'GREATER_THAN_EQUAL', value: this.filters.totalReviews });
    }
    if (this.filters.acceptsOneToMany !== null) {
      filterList.push({ columnName: 'acceptsOneToMany', operation: 'EQUAL', value: this.filters.acceptsOneToMany });
    }

    const request: FilterRequest = {
      filterList: filterList,
      sortCriteria: [],
      page: 0,
      size: 10
    };

    this.searchService.getTutors(request).subscribe(tutors => {
      this.filteredTutors = tutors;
    });
  }

  initSearch(bio: string): void {
    const filterList: Filter[] = [];

    filterList.push({ columnName: 'bio', operation: 'LIKE', value: bio });

    const request: FilterRequest = {
      filterList: filterList,
      sortCriteria: [],
      page: 0,
      size: 10
    };

    this.searchService.getTutors(request).subscribe(tutors => {
      this.filteredTutors = tutors;
      this.cdr.detectChanges();
    });
  }

}
