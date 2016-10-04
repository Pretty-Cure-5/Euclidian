// newCube(size); makes a hollow cube
const newCube = (s) => {
    var xyz = [];
    var range = [...Array(s).keys()];
    for(var x in range) {for(var y in range) {for(var z in range) {
        if(x==0||y==0||z==0||x==s-1||y==s-1||z==s-1){
            xyz.push([parseInt(x),parseInt(y),parseInt(z)]);
        }
    }}}
    return xyz;
};
var cube = newCube(3);
//console.log(cube);

// This cube has bits missing to divide it into two groups for two colours.
var cube = [
    [0,0,0],[0,0,1],[0,0,2],[0,1,0],[0,1,1],[0,1,2],[0,2,0],[0,2,1],[0,2,2],
    [2,0,0],[2,0,1],[2,0,2],[2,1,0],[2,1,1],[2,1,2],[2,2,0],[2,2,1],[2,2,2],
    [3,3,3],[3,3,4]
];
/**
xyz:
xyz=[[x,y,z],[x,y,z],[x,y,z]];

distance:
Defines the grouping threshold.

riddle:
Minimum size of a group.
If groups have fewer than riddle points, they will be filtered out.
Strip out outlying points; groups with less than "n" number of points in them.
**/
const groupByProximity = (xyz, distance, riddle) => {
    /** variables **/
    var c = 0;// number of groups (group_number for next group)
    var rgb = [];// this groups xyz by proximity
    /** functions **/
    const newGroup=(id)=>{c+=1;return [id,[]]}; // group[0] = group_number, push [x,y,z] into group[1]
    const distance3D=(a,b)=>{return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2));};
    const unique=(a)=>a.filter((item,pos)=>{return a.indexOf(item)==pos;});
    const merge = (p, tmp) => {
        var i=0, j=0;
        tmp.push(newGroup('tmp'));
        // for "group" in tmp
        for(var g in tmp) {
            // is point in the group?
            if(-1<p[0].indexOf(tmp[g][0])) {
                tmp[c-1][1] = tmp[c-1][1].concat(tmp[g][1]);
                delete tmp[g];
                i+=1, j+=1;
            } else {
                if(i && j) {tmp[g][0]-=i; j-=1;}
            }
        }
        // removed deleted groups
        tmp=tmp.filter(function(n){return n!==undefined});
        // c is global
        c=tmp.length;
        tmp[c-1][0] = c-1;
        tmp[c-1][1] = tmp[c-1][1].concat(p[1]);
        return tmp;
    };
    const genColours = () => {
        const range = [...Array(2).keys()], m = ['88','FF'], n = ['00','FF'];
        var a = [[],[]];
        for(var r in range) {for(var g in range) {for(var b in range) {
            a[0].push(m[r]+m[g]+m[b]);
            if(!((r==0)&&(g==0)&&(b==0))) {a[1].push(n[r]+n[g]+n[b])};
        }}}
        return a[0].concat(a[1]);
    };
    /** grouping **/
    while(xyz.length) {
        // pull out a "point" from xyz, and push empty "group" array into point
        var p = [[],xyz.pop()];
        // for "group" in rgb
        for(var g in rgb) {
            // for "each" in group
            for(var e in rgb[g][1]) {
                var d = distance3D(p[1], rgb[g][1][e]);
                if(d<distance) {p[0].push(rgb[g][0]); break;}
            }
        }
        // reduce p.groups
        p[0] = unique(p[0]);
        // check p.groups
        if(1<p[0].length) {
            // join/merge; refactor rgb.groups, and c=rgb.groups.length
            rgb.push(newGroup('temp'));
            rgb=merge(p,rgb);
            rgb[p[0][0]][1].push(p[1]);
        } else if(p[0].length<1) {
            // new group
            rgb.push(newGroup(c));
            // push
            rgb[c-1][1].push(p[1]);
        } else {
            // nothing; add p to rgb.group
            rgb[p[0][0]][1].push(p[1]);
        }
    }
    // xyz should be empty by this point (rgb is grouped); free to use.
    if(xyz.length!=0) {console.log('ERR: Leaking!')};
    xyz = rgb;
    rgb = [];
    /** selective regrouping **/
    // for "group" in xyz
    for(var g in xyz){if(xyz[g][1].length<riddle){delete xyz[g];}}
    xyz=xyz.filter(function(n){return n!==undefined});
    /** colourise **/
    var colours = genColours();
    // for "group" in xyz
    for(var g in xyz) {
        // selective colour hex
        var z = g;
        while(colours.length<=z) {z-=colours.length;}
        var colour = colours[z];
        // for "point" in group
        for(var p in xyz[g][1]) {
            // need a format [x,y,z,r,g,b] will do, or [x,y,z,hex]
            //xyz[g][1][p] = xyz[g][1][p].concat(colour)
            xyz[g][0] = colour;
            // ungrouping
            //rgb.push(xyz[g][1][p]);
        }
    }
    /** escape **/
    return xyz;
    //return rgb;
};

// could run this as node.js, or in the browser; see how long it takes
// put xyz instead of cube
var rgb = groupByProximity(cube,1.5,3);
console.log(rgb.length);
console.log(rgb);

/*
I'm going to work on comparing angles/distances of the groups.
The problem is that if anything is connected to the floor, it will be the same colour as the floor; which is where the angles will come in.
I could also use the angle to flatten the groups into a plane...
k-means
*/
