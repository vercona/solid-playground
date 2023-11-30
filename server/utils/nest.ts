type nested<T> = T & {children: nested<T>[] };

export function nest<O>(
  arr:O[],
  sortFn: (a:O, b:O)=>number,
  idKey: keyof O,
  parentKey: keyof O
  // I was gonna take an arbitrary child key too, but TS hates that idea
) {
  let output = [] as nested<O>[];
  let lookup = new Map()

  let sortedComments = arr.toSorted(sortFn)

  for(let baseComment of sortedComments) {
    let comment = {...baseComment, children:[]}
    lookup.set(comment[idKey], comment)
    
    let parentID = comment?.[parentKey]
    if (!parentID) {
      output.push(comment)
    }

    else {
      let parent = lookup.get(parentID)
      parent.children = [...(parent.children||[]), comment]
    }
  }

  //console.log(JSON.stringify(output, null, 2))
  return output
}



interface MinimalComment {
  level: number;
  comment_id: string;
  parent_id: string | null
}
export function nestComments<O extends MinimalComment>(comment_arr: O[]) {
  return nest<O>(
    comment_arr,
    (a, b) => a.level-b.level,
    'comment_id', 
    'parent_id'
  )
}