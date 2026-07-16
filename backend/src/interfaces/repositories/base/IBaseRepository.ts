export interface IBaseRepository<T>{

create (entity : Partial<T>):Promise<T>;

findById(id: string) :Promise<T |null>

updateById(id : string, entity : Partial<T>) : Promise<T | null>

deleteById(id:string) :Promise<boolean>

exists(id:string) : Promise<boolean>

}