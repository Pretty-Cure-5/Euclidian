/** Group By Proximity **/

/** subroutines **/
const
    gbp_distance3D = (a, b) => Math.sqrt(
             Math.pow(a[0] -b[0], 2)
            +Math.pow(a[1] -b[1], 2)
            +Math.pow(a[2] -b[2], 2)
    )
    , gbp_newGroup = (nog, id) => [++nog, [id, []]]// [group_number, [x,y,z]]
    , gbp_unique = a => a.filter((item, pos) => a.indexOf(item) == pos)
    , gbp_clean = a => a.filter(n => n !== undefined)
    , gbp_merge = (nog, p, pcd) => {// nog=nog, p=point, pcd=PointCloudData
        let i=0, j=0, tmp;
        [nog, tmp] = gbp_newGroup(nog, 'tmp');
        pcd.push(tmp);
        // for "group" in pcd
        for(let g in pcd) {
            // is "point" in the group?
            if(-1 < p[0].indexOf(pcd[g][0])) {
                pcd[nog -1][1] = pcd[nog -1][1].concat(pcd[g][1]);
                delete pcd[g];
                ++i, ++j;
            } else {
                if(i && j) {pcd[g][0] -= i; --j;}
            }
        }
        // removed deleted groups
        pcd = gbp_clean(pcd);
        // nog is global
        nog = pcd.length;
        pcd[nog -1][0] = nog -1;
        pcd[nog -1][1] = pcd[nog -1][1].concat(p[1]);
        return pcd;
    }
    , gbp_genColours = () => {
        const range = [...Array(2).keys()], m = ['88', 'FF'], n = ['00', 'FF'];
        let a = [[],[]];
        for(let r in range) {for(let g in range) {for(let b in range) {// r g b
            a[0].push(m[r] +m[g] +m[b]);
            if(!((r == 0) && (g == 0) && (b == 0))) a[1].push(n[r] +n[g] +n[b]);
        }}}
        return a[0].concat(a[1]);
    }
;

/** http://matrix.wikia.com/wiki/Prime_Program
xyz     : xyz=[[x,y,z],[x,y,z],[x,y,z]];
distance: Defines the grouping threshold.
riddle  : Minimum size of a group; filter outlying points.
**/
const groupByProximity = (xyz, distance, riddle) => {
    /** variables **/
    let nog = 0;// number of groups (group_number for next group)
    let rgb = [];// this groups xyz by proximity
    /** grouping **/
    while(xyz.length) {
        // pull out a "point" from xyz, and push empty "group" array into point
        let p = [[], xyz.pop()];
        // for "group" in rgb
        for(let g in rgb) {
            // for "each" in group
            for(let e in rgb[g][1]) {
                let d = gbp_distance3D(p[1], rgb[g][1][e]);
                if(d < distance) {p[0].push(rgb[g][0]); break;}
            }
        }
        // reduce p.groups
        p[0] = gbp_unique(p[0]);
        // check p.groups
        if(1 < p[0].length) {
            // join/merge; refactor rgb.groups, and c=rgb.groups.length
            let tmp;
            [nog, tmp] = gbp_newGroup(nog, 'tmp');
            rgb.push(tmp);
            rgb = gbp_merge(nog, p, rgb);
            rgb[p[0][0]][1].push(p[1]);
        } else if(p[0].length < 1) {
            // new group
            let tmp;
            [nog, tmp] = gbp_newGroup(nog, nog);
            rgb.push(tmp);
            // push
            rgb[nog -1][1].push(p[1]);
        } else {
            // nothing; add p to rgb.group
            rgb[p[0][0]][1].push(p[1]);
        }
    }
    // xyz should be empty by this point (rgb is grouped); free to use.
    if(xyz.length != 0) {console.log('ERR: Leaking!')};
    /** selective regrouping **/
    // for "group" in rgb
    for(let g in rgb) {if(rgb[g][1].length < riddle) {delete rgb[g];}}
    rgb = gbp_clean(rgb);
    /** colourise **/
    let colours = gbp_genColours();
    // for "group" in rgb
    for(let g in rgb) {
        // selective colour hex
        let z = g;
        while(colours.length <= z) {z -= colours.length;}
        let colour = colours[z];
        rgb[g][0] = colour;
    }
    /** escape **/
    return rgb;
};

// Self Modularity
module.exports = {
    groupByProximity: groupByProximity
    , gbp_newGroup  : gbp_newGroup
    , gbp_distance3D: gbp_distance3D
    , gbp_unique    : gbp_unique
    , gbp_clean     : gbp_clean
    , gbp_merge     : gbp_merge
    , gbp_genColours: gbp_genColours
}
