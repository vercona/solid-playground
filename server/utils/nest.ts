type nested<T> = T & {children: nested<T>[] };

export function nest<O>(
  arr:O[],
  idKey: keyof O,
  parentKey: keyof O,
  parent: null|string = null
) {
  let filterComments = arr.filter(el => el[parentKey] === parent)

  let out = [] as nested<O>[]
  for(let baseComment of filterComments) {
    let asParent = baseComment[idKey] as string
    let comment:any = {
      ...baseComment,
      children: nest(
        arr,
        idKey,
        parentKey,
        asParent
      )
    }
    out.push(comment)
  }

  //console.log(JSON.stringify(output, null, 2))
  return out
}


interface MinimalComment {
  level: number;
  comment_id: string;
  parent_id: string | null
}
export function nestComments<O extends MinimalComment>(comment_arr: O[]) {
  return nest<O>(
    comment_arr,
    'comment_id', 
    'parent_id'
  )
}