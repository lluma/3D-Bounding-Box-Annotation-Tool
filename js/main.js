if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer, scene, camera, stats;
var pointcloud;
var raycaster;
var mouse = new THREE.Vector2();
var intersection = null;
var spheres = [];
var pointsWithSpheres = new Set();
var clock;
var mouseDown;
var highlightMode = false;
var threshold = 0.1;
var pointSize = 0.5;

init();
animate();

var sphereGeometry, sphereMaterial;

function init() {

    var container = document.getElementById( 'container' );

    scene = new THREE.Scene();

    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.y = 1;
    camera.position.z = 3;

    //

    sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
    sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, shading: THREE.FlatShading } );

    //

    var grid = new THREE.GridHelper( 200, 20 );
    grid.setColors( 0xffffff, 0xffffff );
    scene.add( grid );

    //

    renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //

    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = threshold;

    //

    stats = new Stats();
    container.appendChild( stats.dom );

    //

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enabled = true;

    //

    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    // document.getElementById( 'save' ).addEventListener( 'click', save, false );
    // document.getElementById( 'export' ).addEventListener( 'click', save_image, false );
    // document.getElementById( 'move' ).addEventListener( 'click', moveMode, false );
    // document.getElementById( 'label' ).addEventListener( 'click', labelMode, false );

    //

    // initNav();
    // show(document.getElementById('obj0'), Object.keys(data)[0]);

    // loadPCDData('data/result_2018-08-27-15-54-17.pcd');
    loadPCDData('data/test.pcd');
}

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onDocumentMouseUp( event ) {

    event.preventDefault();
    mouseDown = false;

}

function onDocumentMouseDown( event ) {

    event.preventDefault();
    mouseDown = true;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

var toggle = 0;

function render() {

    // raycaster.setFromCamera( mouse, camera );

    // var intersections = raycaster.intersectObjects( [pointcloud] );
    // intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

    // if ( toggle > 0.005 && intersection !== null && !(
    //         pointsWithSpheres.has(intersection.index)) && mouseDown
    //         && !controls.enabled) {

    //     var point = pointcloud.geometry.vertices[intersection.index];
    //     var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    //     sphere.position.copy( point );
    //     scene.add(sphere);
    //     spheres.push(sphere);
    //     pointsWithSpheres.add(intersection.index);

    //     toggle = 0;
    // }

    // toggle += clock.getDelta();

    renderer.render( scene, camera );

}

function loadPCDData(url) {

    // ASCII pcd files
    let pcdLoader = new THREE.PCDLoader();

    pcdLoader.load(url, function (mesh) {
        scene.add(mesh);
    });
}

// https://stackoverflow.com/a/15327425/4855984
String.prototype.format = function(){
    var a = this, b;
    for(b in arguments){
        a = a.replace(/%[a-z]/,arguments[b]);
    }
    return a; // Make chainable
};