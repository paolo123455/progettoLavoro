import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InsPService {

  constructor(private client: HttpClient) { }

  test = (): void => console.log("test ok ")

  testRest = (): Observable<any[]> => this.client.get<any[]>('http://node:8080/testRest')

  setup = (setup: String): void => {

    let query = ""
    if (setup == "insP") {
      query = ""
    }
  }
  rootURL = '/esegui/query';

  select(query: String): Observable<any[]> {
    return  this.client.post<any[]>('/esegui/query/selezione' , {"query" : query})
  }

  structUndestanding(tabella: string | undefined): Observable<Object> {
    console.log("fatto")
    return  this.client.post('/esegui/query/dizionario' , {"query" :tabella})
  }

  get_cost_model(id: string ): Observable<Object> {
 
    return  this.client.post('/esegui/query/get/cost/model' , {"id_odl" : id})
  }

  select_cost_modelDB(query: String): Observable<any[]> {
    return  this.client.post<any[]>('/esegui/query/selezione/costmodel' , {"query" : query})
  }


  // select(query: String): Observable<any[]> {
  //   return this.client.post<any[]>('http://node:8080/esegui/query/selezione', { "query": query })
  // }

  // structUndestanding(tabella: string | undefined): Observable<Object> {
  //   console.log("fatto")

  //   return this.client.post('http://node:8080/esegui/query/dizionario', { "query": tabella })


  // }



}
