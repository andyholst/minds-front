import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CookieService } from '../services/cookie.service';
import { environment } from '../../../environments/environment';
import { map, retry } from 'rxjs/operators';

/**
 * API request methods constants
 */
export enum ApiRequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

/**
 * API request data structure
 */
export type ApiRequestData = {
  [key: string]: any;
} | null;

/**
 * API request query params structure
 */
export type ApiRequestQueryParams = {
  [key: string]: any;
} | null;

/**
 * API Response structure
 */
export interface ApiResponse {
  status: string;
  [key: string]: any;
}

/**
 * API request options passed to the methods
 */
export type ApiRequestOptions = {
  upload?: boolean;
  withCredentials?: boolean;
  headers?: { [name: string]: string | string[] };
};

/**
 * API client class that uses Angular/HttpClient observables with our custom headers. Supports normal requests and uploads via POST.
 */
@Injectable()
export class ApiService {
  protected baseUrl: string = '/';

  constructor(
    @Inject('ORIGIN_URL') baseUrl: string,
    protected httpClient: HttpClient,
    protected cookie: CookieService
  ) {
    if (baseUrl) {
      // console.log(`${baseUrl}/`);
      this.baseUrl = `${baseUrl}/`;
    }
  }

  get(
    endpoint: string,
    queryParams: ApiRequestQueryParams = null,
    retryTimes: number = 0,
    options: ApiRequestOptions = {}
  ): Observable<ApiResponse> {
    const request = this.request(
      ApiRequestMethod.GET,
      this._buildQueryString(endpoint, queryParams),
      {},
      options
    );

    if (retryTimes) {
      return request.pipe(retry(retryTimes));
    }

    return request;
  }

  post(
    endpoint: string,
    data: ApiRequestData = null,
    options: ApiRequestOptions = {}
  ): Observable<ApiResponse> {
    return this.request(
      ApiRequestMethod.POST,
      this.baseUrl + endpoint,
      data,
      options
    );
  }

  put(
    endpoint: string,
    data: ApiRequestData = null,
    options: ApiRequestOptions = {}
  ): Observable<ApiResponse> {
    return this.request(
      ApiRequestMethod.PUT,
      this.baseUrl + endpoint,
      data,
      options
    );
  }

  delete(
    endpoint: string,
    queryParams: ApiRequestQueryParams = null,
    options: ApiRequestOptions = {}
  ): Observable<ApiResponse> {
    return this.request(
      ApiRequestMethod.DELETE,
      this._buildQueryString(endpoint, queryParams),
      {},
      options
    );
  }

  /**
   * Equivalent to delete(...) function, but passes data through as a payload
   * rather than querystring.
   *
   * @param endpoint - endpoint to hit
   * @param data - payload
   * @param options - api options
   * @returns Observable<ApiResponse> - api response
   */
  deleteWithPayload(
    endpoint: string,
    data: ApiRequestData = null,
    options: ApiRequestOptions = {}
  ): Observable<ApiResponse> {
    return this.request(
      ApiRequestMethod.DELETE,
      this.baseUrl + endpoint,
      data,
      options
    );
  }

  upload(
    endpoint: string,
    data: ApiRequestData,
    options: ApiRequestOptions
  ): Observable<HttpEvent<ApiResponse>> {
    return this.httpClient
      .request<ApiResponse>(
        ApiRequestMethod.POST,
        this.baseUrl + endpoint,
        this._buildOptions(
          {
            ...options,
            upload: true,
          },
          data,
          true
        )
      )
      .pipe(
        map(event => {
          if (event.type === HttpEventType.Response) {
            const response = event.body;

            if (
              !response ||
              !response.status ||
              response.status !== 'success'
            ) {
              throw new Error(
                (response && response.message) || 'Internal server error'
              );
            }
          }

          return event;
        })
      );
  }

  request(
    method: ApiRequestMethod,
    endpoint: string,
    data: ApiRequestData,
    options: ApiRequestOptions
  ): Observable<ApiResponse> {
    if (options.upload) {
      return throwError(new Error('Use the upload() method for uploads'));
    }

    return this.httpClient
      .request<ApiResponse>(
        method,
        endpoint,
        this._buildOptions(
          {
            ...options,
            upload: false,
          },
          data,
          false
        )
      )
      .pipe(
        map(response => {
          if (!response || !response.status || response.status !== 'success') {
            throw new Error(
              (response && response.message) || 'Internal server error'
            );
          }

          return response;
        })
      );
  }

  /**
   * Builds HTTP Request endpoint string
   * @param endpoint
   * @param queryParams
   * @private
   */
  protected _buildQueryString(
    endpoint: string,
    queryParams: ApiRequestQueryParams
  ): string {
    let output = endpoint;

    if (/^\/([^\/])/.test(output)) {
      output = output.substr(1);
    }

    output = this.baseUrl.replace(/\/+$/, '') + '/' + output;
    // console.log(output);
    if (queryParams) {
      const queryString = Object.keys(queryParams)
        .map(
          key =>
            `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
        )
        .join('&');

      if (queryString) {
        output += (endpoint.indexOf('?') > -1 ? '&' : '?') + queryString;
      }
    }

    return output;
  }

  /**
   * Builds HTTP Request options object
   * @param {ApiRequestOptions} options
   * @param {ApiRequestData} data
   * @param {boolean} withEvents
   *
   * @private
   */
  protected _buildOptions(
    options: ApiRequestOptions,
    data: ApiRequestData,
    withEvents: false
  ): { observe: 'body' };
  protected _buildOptions(
    options: ApiRequestOptions,
    data: ApiRequestData,
    withEvents: true
  ): { observe: 'events' };
  protected _buildOptions<T extends boolean>(
    options: ApiRequestOptions,
    data: ApiRequestData,
    withEvents: T
  ): any {
    const requestOptions: any = {
      observe: withEvents ? 'events' : 'body',
      responseType: 'json',
      reportProgress: options.upload,
      withCredentials: options.withCredentials,
      headers: this._buildHeaders(),
    };

    if (!options.upload) {
      // Normal JSON requests

      if (data) {
        requestOptions.body = JSON.stringify(data);
      }
    } else {
      if (!data) {
        throw new Error('No data');
      }

      // File uploads
      const formData = new FormData();

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
        }
        formData.append(key, data[key]);
      }

      requestOptions.body = formData;
    }

    return requestOptions;
  }

  /**
   * Builds HTTP Request headers object
   * @private
   */
  protected _buildHeaders(): HttpHeaders {
    const XSRF_TOKEN = this.cookie.get('XSRF-TOKEN') || '';

    return new HttpHeaders({
      'X-XSRF-TOKEN': XSRF_TOKEN,
      'X-VERSION': environment.version,
    });
  }
}
