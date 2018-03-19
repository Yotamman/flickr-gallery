import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import Lightbox from 'react-images';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      expandImage: false,
      currentImage: 0
    };
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.urlFromObj = this.urlFromObj.bind(this);
  }

  openLightbox(expanded,index) {
        this.setState({
          expandImage: expanded,
          currentImage: index
        });
  }

  gotoPrevious(){
    this.setState({
      currentImage: this.state.currentImage - 1
    });
    
  }

  gotoNext(){
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  }

  handleClickImage () {
    if (this.state.currentImage === this.state.images.length - 1) return;

    this.gotoNext();
  }

  closeLightbox(){
    this.setState({
      currentImage: 0,
      expandImage: false
    });
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({images: res.photos.photo});
        }
      });
  }

  onScroll(){
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100)) {
      // let newPerPage = this.state.page + 90;
      // this.setState({page: newPerPage})
      // this.getImages(props.tag)
      
      alert('scroll!!');
    }
  }

  componentDidMount() {
    window.addEventListener('resize',
        this.setState({
          galleryWidth: document.body.clientWidth
        })
    );
    //window.addEventListener('scroll', this.onScroll, false);
    this.getImages(this.props.tag);
  }

  urlFromObj(obj) {
    return {src: `https://farm${obj.farm}.staticflickr.com/${obj.server}/${obj.id}_${obj.secret}.jpg`}
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  render() {
    const { expandImage } = this.state;
    if(expandImage){
        var fullScrImage=
                        <Lightbox
                            images={this.state.images.map(img => this.urlFromObj(img))}
                            currentImage={this.state.currentImage}
                            isOpen={this.state.expandImage}
                            onClickPrev={this.gotoPrevious}
                            onClickNext={this.gotoNext}
                            onClose={this.closeLightbox}
                        />
    }
    else fullScrImage=null;
    var i=0;
    return (
        <div className="gallery-root">
          { this.state.images.map(dto => {
            return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} getExpanded={this.openLightbox} index={i++}/>;
          })}
        <div> { fullScrImage }</div>
        </div>
    );
  }
}

export default Gallery;