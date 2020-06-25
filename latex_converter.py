import matplotlib.pyplot as plt
import numpy as np

def convert_tex_document(filename):
        import tex2pix
        f = open(filename)
        r = tex2pix.Renderer(f)
        r.mkpdf(filename.replace(".tex", ".pdf"))

if __name__=="__main__":
    distances_draw(" 0011209.json")