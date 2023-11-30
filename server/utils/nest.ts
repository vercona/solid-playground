type Nested<T> = T & {children: Nested<T>[] };

export function nest<O> (
  arr: O[],
  idKey: keyof O,
  parentKey: keyof O,
  parent: null|string = null
): Nested<O>[] {
  return arr
    .filter(el => el[parentKey] === parent)
    .map( (baseComment: O) => ({
      ...baseComment,
      children: nest(
        arr,
        idKey,
        parentKey,
        baseComment[idKey] as string
      )
    }))
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