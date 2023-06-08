import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../_model/Pokemon';
import { ReplaySubject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  public pokemons: Pokemon[] = [];

  constructor(
    private httpClient: HttpClient,
  ) { 
    const allPokemonsUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=300'
    // no final da URL da pra dizer quantos pokemons quer (no LIMIT)

    this.httpClient.get<any>(allPokemonsUrl).pipe(
      map(value => value.results),
      map((value:any)=>{
        return from(value).pipe(
          mergeMap((v:any) => this.httpClient.get(v.url))
        )
      }),
      mergeMap(value => value)
    ).subscribe((result: any) => {
      const pokemon: Pokemon = {
        number: result.id,
        name: result.name,
        image: result.sprites.front_default,
        types: result.types.map((t: any) => t.type.name),
      }

      this.pokemons[result.id] = pokemon;
    })
  }
}
