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
          currentImage: 0,
          // pageNum: 1
        };
        this.closeLightbox = this.closeLightbox.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
        this.openLightbox = this.openLightbox.bind(this);
        this.toObj = this.toObj.bind(this);
        this.getImagesWPage = this.getImagesWPage.bind(this);
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

      getImagesWPage(tag) {
        const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&page=${this.state.pageNum}&per_page=100&format=json&nojsoncallback=1`;
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

      getImages(tag){
        this.getImagesWPage(tag,1);
      }

      // onScroll(){ 
      //   console.log('alert');
      //   if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100)) {
      //       let newPageNum=this.state.pageNum + 1;
      //       this.setState({pageNum: newPageNum});
      //       getImagesWPage(this.props.tag,this.state.pageNum)
      //   }
      // }

      componentDidMount() {
        window.addEventListener('resize',
            this.setState({
              galleryWidth: document.body.clientWidth
            })
        );
        // window.addEventListener('scroll', this.onScroll, false);
        this.getImages(this.props.tag);
      }

      toObj(obj) {
        return {src: `https://farm${obj.farm}.staticflickr.com/${obj.server}/${obj.id}_${obj.secret}_b.jpg`}
      }

      componentWillReceiveProps(props) {
        this.getImages(props.tag);
      }

      render() {
        const { expandImage } = this.state;
        if(expandImage){
            var fullScrImage=
                            <Lightbox
                                images={this.state.images.map(img => this.toObj(img))}//maps the obj array of images
                                currentImage={this.state.currentImage}
                                isOpen={this.state.expandImage}
                                onClickPrev={this.gotoPrevious}
                                onClickNext={this.gotoNext}
                                onClose={this.closeLightbox}
                                onClickImage={this.gotoNext}
                                backdropClosesModal={true}
                                imageCountSeparator={' / '}
                            />
        }
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